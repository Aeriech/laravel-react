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
        $validator = Validator::make($request->all(), [
            'loginData.email' => 'required|email',
            'loginData.password' => 'required',
        ]);

        $validator->setCustomMessages([
            'required' => 'The :attribute field is required.',
            'email' => 'The :attribute field must be a valid email address.',
        ]);

        $validator->setAttributeNames([
            'loginData.email' => 'Email',
            'loginData.password' => 'Password',
        ]);

        if ($validator->fails()) {
            throw new \InvalidArgumentException($validator->errors()->first());
        }
        try {
            $credentials = $request->input('loginData');
            if (!Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
                return response()->json([
                    'message' => 'Provided email or password incorrect ',
                ], 500);
            }
            /** @var User $user */
            $user = Auth::user();
            $token = $user->createToken('main')->plainTextToken;
            $user->url = config('app.url');
            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => 'Successfully Logged In',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred during login: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function signup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'signUpData.name' => 'required|string',
            'signUpData.email' => 'required|email|unique:users,email',
            'signUpData.password' => 'required|string|min:8|same:signUpData.confirmPassword',
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

            $user = User::create([
                'image' => null,
                'name' => $signUpData['name'],
                'email' => $signUpData['email'],
                'password' => bcrypt($signUpData['password']),
            ]);

            $token = $user->createToken('main')->plainTextToken;
            $user->url = config('app.url');
            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => "Successfully Created Account"
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred during signup: ' . $e->getMessage(),
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
