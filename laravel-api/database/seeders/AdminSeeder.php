<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create SuperAdmin user
        User::firstOrCreate([
            'email' => 'admin@demo.com'
        ], [
            'username' => 'Super Admin',
            'password' => bcrypt('password123'),
            'role' => 'superAdmin'
        ]);

        // Create additional test users
        User::firstOrCreate([
            'email' => 'owner@demo.com'
        ], [
            'username' => 'Demo Owner',
            'password' => bcrypt('password123'),
            'role' => 'owner'
        ]);

        User::firstOrCreate([
            'email' => 'user@demo.com'
        ], [
            'username' => 'Demo User',
            'password' => bcrypt('password123'),
            'role' => 'user'
        ]);

        $this->command->info('Demo users created successfully!');
        $this->command->info('SuperAdmin: admin@demo.com / password123');
        $this->command->info('Owner: owner@demo.com / password123');
        $this->command->info('User: user@demo.com / password123');
    }
}
