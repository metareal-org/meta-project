<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecoverAddressRequest;
use App\Models\User;
use Illuminate\Http\Client\Request;
use SWeb3\Accounts;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken;

class UserController extends Controller
{
    private function isSignatureVerified(RecoverAddressRequest $request): bool
    {
        try {
            $recoveredAddress = Accounts::signedMessageToAddress($request->message, $request->signature);
            return $recoveredAddress == $request->address;
        } catch (\Exception $e) {
            Log::error('Signature verification failed: ' . $e->getMessage());
            return false;
        }
    }

    public function authenticate(RecoverAddressRequest $request)
    {
        if (!$this->isSignatureVerified($request)) {
            return response()->json(['error' => 'Invalid signature'], 401);
        }

        try {
            $user = User::firstOrCreate(['address' => $request->address]);
            return $this->login($user, $request);
        } catch (\Exception $e) {
            Log::error('Authentication failed: ' . $e->getMessage());
            return response()->json(['error' => 'Authentication failed'], 500);
        }
    }

    public function login(User $user, $request)
    {
        try {
            // Check for existing token in the Authorization header
            $tokenFromRequest = $request->bearerToken();
            
            if ($tokenFromRequest) {
                $token = PersonalAccessToken::findToken($tokenFromRequest);
                
                if ($token && !$this->isTokenExpired($token) && $token->tokenable_id === $user->id) {
                    // Token is valid and belongs to the user, return it
                    return $this->respondWithToken($tokenFromRequest, $user);
                }
            }
            
            // If no valid token found, create a new one
            // Revoke any existing tokens for this user
            $user->tokens()->delete();

            $newToken = $user->createToken('auth_token', ['*'], $this->getTokenExpiration());

            return $this->respondWithToken($newToken->plainTextToken, $user);
        } catch (\Exception $e) {
            Log::error('Token creation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Token creation failed'], 500);
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

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Successfully logged out']);
    }
}