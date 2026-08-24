<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;

class StatsController extends Controller
{
    /**
     * Public platform stats shown on the homepage.
     */
    public function index()
    {
        $activeCompanies = Company::where('status', 'active');

        return response()->json([
            'status' => 'success',
            'stats' => [
                'verified_companies' => (clone $activeCompanies)->where('is_verified', true)->count(),
                'service_categories' => (clone $activeCompanies)
                    ->whereNotNull('activity_sector')
                    ->distinct('activity_sector')
                    ->count('activity_sector'),
                'users' => User::whereIn('role', ['user', 'owner'])->count(),
            ]
        ]);
    }
}
