<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function editProfile(Request $request){
        try {
            $validatedData = Validator::make($request->all(), [
                'userDetails.name' => ['required', 'string', 'regex:/^[A-Za-z\s]+$/'],
                'userDetails.email' => ['required', 'email'],
                'passwordDetails.newPassword' => ['same:passwordDetails.confirmPassword', 'min:8'],
            ], [
                'userDetails.name.required' => 'The name field is required.',
                'userDetails.name.string' => 'The name field must be a string.',
                'userDetails.name.regex' => 'The name field should not contain special characters.',
                'userDetails.email.required' => 'The email field is required.',
                'userDetails.email.email' => 'The email field must be a valid email address.',
                'passwordDetails.newPassword.same' => 'The new password and confirm password fields must match.',
                'passwordDetails.newPassword.min' => 'The new password must be at least 8 characters long.',
            ]);

            if ($validatedData->fails()) {
                throw new \InvalidArgumentException($validatedData->errors()->first());
            }

            $image = $request->userDetails['image'];
            $imageName = null;

            if ($image) {
                // decode the base64 image data
                $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));

                // create an image resource from the data
                $imageRes = imagecreatefromstring($imageData);

                // get the original dimensions of the image
                $origWidth = imagesx($imageRes);
                $origHeight = imagesy($imageRes);

                // calculate the new dimensions for the resized image
                $maxWidth = 800;
                $maxHeight = 600;
                $scale = min($maxWidth / $origWidth, $maxHeight / $origHeight);
                $newWidth = $origWidth * $scale;
                $newHeight = $origHeight * $scale;

                // create a new image resource for the resized image
                $newImageRes = imagecreatetruecolor($newWidth, $newHeight);

                // copy and resize the original image to the new image resource
                imagecopyresampled($newImageRes, $imageRes, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);

                // save the resized image to disk
                $imageName = time() . '_' . uniqid() . '.png';
                $imagePath = public_path('profiles/') . $imageName;
                $url = config('app.url');
                $imageUrl = $url . '/images/' . $imageName;
                imagepng($newImageRes, $imagePath);

                // free up memory
                imagedestroy($imageRes);
                imagedestroy($newImageRes);
            }

            $user = User::find($request->userDetails['userId']);

            $user->name = $validatedData->validated()['userDetails']['name'];
            $user->email = $validatedData->validated()['userDetails']['email'];
            $resetToken = false;

            if ($request->input('passwordDetails.oldPassword')) {
                if (Hash::check($request->input('passwordDetails.oldPassword'), $user->password)) {
                    $user->password = Hash::make($request->input('passwordDetails.newPassword'));
                    $user->save();
                    $resetToken = true;
                    return response()->json([
                        'resetToken' => $resetToken,
                        'message' => 'Password updated successfully',
                    ], 200);
                } else {
                    return response()->json([
                        'message' => 'The old password is invalid.',
                    ], 500);
                }
            }


            if ($imageName) {
                $user->image = $imageName;
            }

            $user->save();
            $user->url = config('app.url');
            return response()->json([
                'user' => $user,
                'message' => 'User updated successfully',
                'resetToken' => $resetToken,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
