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
        // Drop the composite index first — SQLite can't rebuild a column
        // that's still referenced by an index (see the 2025_08_22_171406 migration).
        Schema::table('companies', function (Blueprint $table) {
            $table->dropIndex(['legal_form', 'activity_sector']);
        });

        // SQLite rebuilds the whole table on ->change(), and Laravel's schema
        // introspection doesn't carry over CHECK constraints on OTHER enum
        // columns unless they're re-declared here too — so `status` must be
        // repeated explicitly or its ('active','inactive','pending') CHECK
        // silently disappears from the rebuilt table.
        Schema::table('companies', function (Blueprint $table) {
            $table->enum('legal_form', ['SARL', 'SA', 'SARL_AU', 'SNC', 'SCS', 'SCA', 'EP', 'GIE', 'EI'])
                ->default('SARL')->change();
            $table->enum('status', ['active', 'inactive', 'pending'])
                ->default('pending')->change();
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->index(['legal_form', 'activity_sector']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropIndex(['legal_form', 'activity_sector']);
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->enum('legal_form', ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'LLP', 'S-Corp', 'C-Corp', 'Non-Profit'])
                ->default('LLC')->change();
            $table->enum('status', ['active', 'inactive', 'pending'])
                ->default('pending')->change();
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->index(['legal_form', 'activity_sector']);
        });
    }
};
