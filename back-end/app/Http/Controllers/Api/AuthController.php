<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * User Login with Sanctum Token & Role
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Identifiants invalides / Invalid credentials.'
            ], 401);
        }

        $token = $user->createToken('crm-auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role, // admin, manager, rep, client
                'title' => $user->title,
                'phone' => $user->phone,
                'quota' => $user->quota,
            ]
        ]);
    }

    /**
     * Current authenticated user profile
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    }

    /**
     * Logout & Revoke token
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion effectuée avec succès.'
        ]);
    }

    /**
     * List all team members
     */
    public function users()
    {
        $users = User::select('id', 'name', 'email', 'role', 'title', 'phone', 'quota', 'created_at')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }
}
