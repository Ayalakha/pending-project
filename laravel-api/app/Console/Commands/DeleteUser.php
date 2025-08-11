<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class DeleteUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'delete:user {username}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete a user by username';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $username = $this->argument('username');
        
        $user = User::where('username', $username)->first();
        
        if (!$user) {
            $this->error("User with username '{$username}' not found.");
            return 1;
        }
        
        $this->info("Found user: ID {$user->id}, Username: {$user->username}, Role: {$user->role}");
        
        if ($this->confirm("Are you sure you want to delete this user? This will also delete all their blogs and comments.")) {
            $user->delete();
            $this->info("User '{$username}' has been deleted successfully.");
        } else {
            $this->info("Deletion cancelled.");
        }
        
        return 0;
    }
}








