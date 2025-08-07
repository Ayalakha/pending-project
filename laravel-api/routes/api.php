<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ServiceOrProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Public company routes (browse companies)
Route::get('/companies', [CompanyController::class, 'index']);
Route::get('/companies/search', [CompanyController::class, 'search']);
Route::get('/companies/{company}', [CompanyController::class, 'show']);

// Public service/product routes (browse services/products)
Route::get('/companies/{company}/services-products', [ServiceOrProductController::class, 'index']);
Route::get('/services-products/{serviceOrProduct}', [ServiceOrProductController::class, 'show']);

// Public blog routes (browse blogs)
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{blog}', [BlogController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    // User routes (all authenticated users)
    // Comments on blogs - any authenticated user can comment
    Route::post('/blogs/{blog}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
    
    // Owner routes (company owners)
    Route::middleware('role:owner,superAdmin')->group(function () {
        Route::get('/my-companies', [CompanyController::class, 'userCompanies']);
        Route::post('/companies', [CompanyController::class, 'store']);
        Route::put('/companies/{company}', [CompanyController::class, 'update']);
        Route::delete('/companies/{company}', [CompanyController::class, 'destroy']);
        
        // Service/Product management for company owners
        Route::post('/companies/{company}/services-products', [ServiceOrProductController::class, 'store']);
        Route::put('/services-products/{serviceOrProduct}', [ServiceOrProductController::class, 'update']);
        Route::delete('/services-products/{serviceOrProduct}', [ServiceOrProductController::class, 'destroy']);
    });
    
    // Super Admin routes
    Route::middleware('role:superAdmin')->group(function () {
        // Blog management for superAdmins only
        Route::post('/blogs', [BlogController::class, 'store']);
        Route::put('/blogs/{blog}', [BlogController::class, 'update']);
        Route::delete('/blogs/{blog}', [BlogController::class, 'destroy']);
        
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
