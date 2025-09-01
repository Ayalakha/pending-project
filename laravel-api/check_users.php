<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

echo "=== REAL EXISTING USER CREDENTIALS ===\n\n";

$users = User::select('id', 'username', 'email', 'role', 'first_name', 'last_name')->get();

foreach ($users as $user) {
    echo "ID: {$user->id}\n";
    echo "Username: {$user->username}\n";
    echo "Email: {$user->email}\n";
    echo "Role: {$user->role}\n";
    if ($user->first_name || $user->last_name) {
        echo "Name: {$user->first_name} {$user->last_name}\n";
    }
    echo "Password: [Check seeder for actual password]\n";
    echo "---\n";
}

echo "\nTotal users in database: " . $users->count() . "\n";
