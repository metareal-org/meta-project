<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecoverAddressRequest;
use App\Models\User;
use Illuminate\Http\Request;
use SWeb3\Accounts;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken;

class UserController extends Controller
{
    private function authenticateWithToken($token, $address)
    {
        $tokenModel = PersonalAccessToken::findToken($token);
        if (!$tokenModel) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        $user = $tokenModel->tokenable;
        if (strtolower($user->address) !== strtolower($address)) {
            return response()->json(['error' => 'Token does not match the provided address', 'provider_address' => strtolower($address)], 401);
        }

        if ($this->isTokenExpired($tokenModel)) {
            $tokenModel->delete();
            return response()->json(['error' => 'Token has expired'], 401);
        }

        return $this->respondWithToken($token, $user);
    }

    private function authenticateWithSignature(RecoverAddressRequest $request)
    {
        if (!$this->isSignatureVerified($request)) {
            return response()->json(['error' => 'Invalid signature'], 401);
        }

        try {
            $user = User::firstOrCreate(['address' => strtolower($request->address)]);
            return $this->login($user);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Authentication failed: ' . $e->getMessage()], 500);
        }
    }

    private function login(User $user)
    {
        try {
            Log::info('Login attempt', ['user_id' => $user->id]);
            $user->tokens()->delete();
            $newToken = $user->createToken('auth_token', ['*'], $this->getTokenExpiration());
            Log::info('New token created', ['token_id' => $newToken->accessToken->id]);

            return $this->respondWithToken($newToken->plainTextToken, $user);
        } catch (\Exception $e) {
            Log::error('Token creation failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Token creation failed: ' . $e->getMessage()], 500);
        }
    }

    private function isTokenExpired($token)
    {
        return $token->created_at->lte(now()->subMinutes(config('sanctum.expiration', 60)));
    }

    private function getTokenExpiration()
    {
        return now()->addMinutes(config('sanctum.expiration', 60));
    }

    private function respondWithToken($token, $user)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_at' => $this->getTokenExpiration()->toDateTimeString(),
            'user' => $user
        ], 200);
    }

    private function isSignatureVerified(RecoverAddressRequest $request): bool
    {
        try {
            $recoveredAddress = Accounts::signedMessageToAddress($request->message, $request->signature);
            return strtolower($recoveredAddress) == strtolower($request->address);
        } catch (\Exception $e) {
            Log::error('Signature verification failed: ' . $e->getMessage());
            return false;
        }
    }

    public function authenticate(Request $request)
    {
        $token = $request->bearerToken();
        if ($token) {
            return $this->authenticateWithToken($token, $request->address);
        } else {
            $recoverAddressRequest = new RecoverAddressRequest();
            $recoverAddressRequest->merge($request->all());
            $validator = validator($recoverAddressRequest->all(), $recoverAddressRequest->rules());
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }
            return $this->authenticateWithSignature($recoverAddressRequest);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function show(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'user' => $user
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $validatedData = $request->validate([
            'current_mission' => 'sometimes|integer|min:0|max:100',
            'avatar_url' => 'sometimes|string|max:255',
            'coordinates' => 'sometimes|json',
            'nickname' => 'sometimes|string|min:3|max:80',
        ]);

        try {
            $user->update($validatedData);
            return response()->json([
                'message' => 'User updated successfully',
                'user' => $user
            ], 200);
        } catch (\Exception $e) {
            Log::error('User update failed', ['error' => $e->getMessage(), 'user_id' => $user->id]);
            return response()->json(['error' => 'User update failed: ' . $e->getMessage()], 500);
        }
    }

    public function updateCpAmount(Request $request)
    {
        $user = $request->user();
        $action = $request->input('action');
        $amount = $request->input('amount');

        if (!in_array($action, ['add', 'remove', 'lock', 'unlock', 'setExact'])) {
            return response()->json(['error' => 'Invalid action'], 400);
        }

        $result = $user->{"$action" . "Cp"}($amount);
        if ($result) {
            return response()->json(['message' => 'CP amount updated successfully', 'user' => $user]);
        } else {
            return response()->json(['error' => 'Failed to update CP amount'], 400);
        }
    }

    public function updateMetaAmount(Request $request)
    {
        $user = $request->user();
        $action = $request->input('action');
        $amount = $request->input('amount');

        if (!in_array($action, ['add', 'remove', 'lock', 'unlock', 'setExact'])) {
            return response()->json(['error' => 'Invalid action'], 400);
        }

        $result = $user->{"$action" . "Meta"}($amount);
        if ($result) {
            return response()->json(['message' => 'Meta amount updated successfully', 'user' => $user]);
        } else {
            return response()->json(['error' => 'Failed to update Meta amount'], 400);
        }
    }

}
