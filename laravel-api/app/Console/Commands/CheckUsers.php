<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class CheckUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check users in database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::all(['id', 'username', 'role']);
        $this->info('Users in database:');
        foreach ($users as $user) {
            $this->line("ID: {$user->id}, Username: {$user->username}, Role: {$user->role}");
        }
        return 0;
    }
}
