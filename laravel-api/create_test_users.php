<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->boot();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Create test users
try {
    $testUser = User::create([
        'username' => 'testuser',
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
        'role' => 'user',
        'first_name' => 'Test',
        'last_name' => 'User'
    ]);
    echo "Regular user created: test@example.com / password123\n";
} catch (Exception $e) {
    echo "Regular user already exists or error: " . $e->getMessage() . "\n";
}

try {
    $testOwner = User::create([
        'username' => 'testowner2',
        'email' => 'owner@example.com',
        'password' => Hash::make('password123'),
        'role' => 'owner',
        'first_name' => 'Test',
        'last_name' => 'Owner'
    ]);
    echo "Owner user created: owner@example.com / password123\n";
} catch (Exception $e) {
    echo "Owner user already exists or error: " . $e->getMessage() . "\n";
}

echo "Total users: " . User::count() . "\n";
