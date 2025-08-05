<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CompanyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Public company routes (browse companies)
Route::get('/companies', [CompanyController::class, 'index']);
Route::get('/companies/{company}', [CompanyController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    // User routes (all authenticated users)
    // Comments, etc. will go here
    
    // Owner routes (company owners)
    Route::middleware('role:owner,superAdmin')->group(function () {
        Route::get('/my-companies', [CompanyController::class, 'userCompanies']);
        Route::post('/companies', [CompanyController::class, 'store']);
        Route::put('/companies/{company}', [CompanyController::class, 'update']);
        Route::delete('/companies/{company}', [CompanyController::class, 'destroy']);
    });
    
    // Super Admin routes
    Route::middleware('role:superAdmin')->group(function () {
        Route::get('/admin/users', function () {
            return response()->json(['message' => 'Admin users list']);
        });
    });
});

// Sample API endpoints for React connection (keep for testing)
Route::get('/test', function () {
    return response()->json([
        'message' => 'the api works fine',
        'timestamp' => now(),
        'status' => 'success'
    ]);
});

Route::get('/posts', function () {
    return response()->json([
        'posts' => [
            ['id' => 1, 'title' => 'First Post', 'content' => 'This is the first post content'],
            ['id' => 2, 'title' => 'Second Post', 'content' => 'This is the second post content'],
            ['id' => 3, 'title' => 'Third Post', 'content' => 'This is the third post content'],
        ]
    ]);
});

Route::post('/posts', function (Request $request) {
    return response()->json([
        'message' => 'Post created successfully!',
        'post' => [
            'id' => rand(4, 100),
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'created_at' => now()
        ]
    ], 201);
});
