<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create SuperAdmin user
        User::updateOrCreate([
            'email' => 'superadmin@example.com'
        ], [
            'username' => 'superadmin',
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'password' => Hash::make('superadmin123'),
            'role' => 'superAdmin',
        ]);

        // Also create another admin user with different credentials
        User::updateOrCreate([
            'email' => 'admin@example.com'
        ], [
            'username' => 'admin',
            'first_name' => 'System',
            'last_name' => 'Administrator',
            'password' => Hash::make('admin123'),
            'role' => 'superAdmin',
        ]);

        echo "SuperAdmin users created successfully!\n";
        echo "SuperAdmin credentials: superadmin@example.com / superadmin123\n";
        echo "Admin credentials: admin@example.com / admin123\n";
    }
}
