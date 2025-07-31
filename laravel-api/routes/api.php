<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Sample API endpoints for React connection
Route::get('/test', function () {
    return response()->json([
        'message' => 'Hello from Laravel API!',
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
