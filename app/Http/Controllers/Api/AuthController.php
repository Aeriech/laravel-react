<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validated();
        if (!Auth::attempt($credentials)) {
            return response()->json([
                'error' => 'Provided email or password incorrect ',
            ], 500);
        }
        /** @var User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    public function signup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'signUpData.name' => 'required|string',
            'signUpData.email' => 'required|email|unique:users,email',
            'signUpData.password' => 'required|string|min:6|same:signUpData.confirmPassword',
        ]);

        $validator->setCustomMessages([
            'required' => 'The :attribute field is required.',
            'string' => 'The :attribute field must be a string.',
            'email' => 'The :attribute field must be a valid email address.',
            'unique' => 'The :attribute field has already been taken.',
            'min' => 'The :attribute field must be at least :min characters.',
            'same' => 'The password and confirm password must match.',
        ]);

        $validator->setAttributeNames([
            'signUpData.name' => 'Name',
            'signUpData.email' => 'Email',
            'signUpData.password' => 'Password',
            'signUpData.confirmPassword' => 'Confirm Password',
        ]);

        if ($validator->fails()) {
            throw new \InvalidArgumentException($validator->errors()->first());
        }


        try {
            $signUpData = $request->input('signUpData');

            if (empty($signUpData) || !is_array($signUpData)) {
                throw new \Exception('Invalid signUpData');
            }

            $userData = $signUpData;

            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => bcrypt($userData['password']),
            ]);

            $token = $user->createToken('main')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => "Successfully Created Account"
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred during signup: ' . $e->getMessage(),
            ], 500);
        }
    }



    public function logout(Request $request)
    {
        /** @var User $user */
        // $user = $request->user();
        // $user->currentAccessToken()->delete();
        // return response()->json([
        //     ''
        // ], 204);
    }
}
