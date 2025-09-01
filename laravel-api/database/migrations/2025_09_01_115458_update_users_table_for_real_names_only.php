<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Make first_name and last_name required
            $table->string('first_name')->nullable(false)->change();
            $table->string('last_name')->nullable(false)->change();
            
            // Make username nullable since we'll use first_name/last_name for display
            $table->string('username')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Revert changes
            $table->string('first_name')->nullable()->change();
            $table->string('last_name')->nullable()->change();
            $table->string('username')->nullable(false)->change();
        });
    }
};
