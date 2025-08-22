<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test user
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'username' => 'testuser',
                'password' => Hash::make('password123'),
                'role' => 'user',
                'first_name' => 'Test',
                'last_name' => 'User'
            ]
        );

        // Create test owner
        User::updateOrCreate(
            ['email' => 'owner@example.com'],
            [
                'username' => 'testowner',
                'password' => Hash::make('password123'),
                'role' => 'owner',
                'first_name' => 'Test',
                'last_name' => 'Owner'
            ]
        );

        echo "Test users created successfully!\n";
        echo "User: test@example.com / password123 (role: user)\n";
        echo "Owner: owner@example.com / password123 (role: owner)\n";
    }
}
