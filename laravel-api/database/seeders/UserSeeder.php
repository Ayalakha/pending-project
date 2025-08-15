<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create default super admin
        User::firstOrCreate([
            'email' => 'admin@example.com'
        ], [
            'username' => 'Super Administrator',
            'password' => bcrypt('admin123'),
            'role' => 'superAdmin'
        ]);

        // Create additional test users
        User::firstOrCreate([
            'email' => 'user@example.com'
        ], [
            'username' => 'Test User',
            'password' => bcrypt('password'),
            'role' => 'user'
        ]);

        User::firstOrCreate([
            'email' => 'owner@example.com'
        ], [
            'username' => 'Business Owner',
            'password' => bcrypt('password'),
            'role' => 'owner'
        ]);

        $this->command->info('Default users created successfully!');
        $this->command->info('Super Admin: admin@example.com / admin123');
        $this->command->info('Test User: user@example.com / password');
        $this->command->info('Business Owner: owner@example.com / password');
    }
}
