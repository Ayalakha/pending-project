<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Clear existing data (SQLite compatible)
        DB::statement('PRAGMA foreign_keys = OFF;');
        \App\Models\Comment::truncate();
        \App\Models\Blog::truncate();
        \App\Models\ServiceOrProduct::truncate();
        \App\Models\Company::truncate();
        \App\Models\User::truncate();
        DB::statement('PRAGMA foreign_keys = ON;');

        // Run seeders in order (due to foreign key dependencies)
        $this->call([
            UserSeeder::class,
            CompanySeeder::class,
            ServiceOrProductSeeder::class,
            BlogSeeder::class,
        ]);
        $this->command->info('All sample data seeded successfully!');
    }
}
