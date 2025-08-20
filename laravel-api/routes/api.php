<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ServiceOrProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Public company routes (browse companies)
Route::get('/companies', [CompanyController::class, 'index']);
Route::get('/companies/search', [CompanyController::class, 'search']);
Route::get('/companies/{company}', [CompanyController::class, 'show']);

// Public service/product routes (browse services/products)
Route::get('/companies/{company}/services-products', [ServiceOrProductController::class, 'index']);
Route::get('/services-products/{serviceOrProduct}', [ServiceOrProductController::class, 'show']);

// Public blog routes (browse blogs)
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{blog}', [BlogController::class, 'show']);
Route::get('/blogs/{blog}/comments', [CommentController::class, 'index']);

// Public review routes (view reviews)
Route::get('/companies/{company}/reviews', [ReviewController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::get('/auth/profile', [AuthController::class, 'profile']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);
    
    // User routes (all authenticated users)
    // Comments on blogs - any authenticated user can comment
    Route::post('/blogs/{blog}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
    
    // Reviews - any authenticated user can review companies
    Route::post('/companies/{company}/reviews', [ReviewController::class, 'store']);
    Route::get('/companies/{company}/user-review', [ReviewController::class, 'getUserReview']);
    Route::put('/reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);
    Route::post('/reviews/{review}/helpful', [ReviewController::class, 'toggleHelpful']);
    
    // Owner routes (company owners)
    Route::middleware('role:owner,superAdmin')->group(function () {
        Route::get('/my-companies', [CompanyController::class, 'userCompanies']);
        Route::post('/companies', [CompanyController::class, 'store']);
        Route::put('/companies/{company}', [CompanyController::class, 'update']);
        Route::delete('/companies/{company}', [CompanyController::class, 'destroy']);
        
        // Service/Product management for company owners
        Route::post('/companies/{company}/services-products', [ServiceOrProductController::class, 'store']);
        Route::put('/services-products/{serviceOrProduct}', [ServiceOrProductController::class, 'update']);
        Route::delete('/services-products/{serviceOrProduct}', [ServiceOrProductController::class, 'destroy']);
    });
    
    // Super Admin routes
    Route::middleware('role:superAdmin')->group(function () {
        // Blog management for superAdmins only
        Route::post('/blogs', [BlogController::class, 'store']);
        Route::put('/blogs/{blog}', [BlogController::class, 'update']);
        Route::delete('/blogs/{blog}', [BlogController::class, 'destroy']);
        
        // Content Moderation
        Route::get('/admin/content', [App\Http\Controllers\Admin\ContentModerationController::class, 'index']);
        Route::post('/admin/content/moderate', [App\Http\Controllers\Admin\ContentModerationController::class, 'moderate']);
        Route::get('/admin/content/{type}/{id}', [App\Http\Controllers\Admin\ContentModerationController::class, 'show']);
        Route::get('/admin/content/stats', [App\Http\Controllers\Admin\ContentModerationController::class, 'stats']);
        
        Route::get('/admin/users', function () {
            return response()->json(['message' => 'Admin users list']);
        });
    });
});

// Sample API endpoints for React connection (keep for testing)
Route::get('/test', function () {
    return response()->json([
        'message' => 'the api works fine',
        'timestamp' => now(),
        'status' => 'success'
    ]);
});

Route::get('/posts', function () {
    return response()->json([
        'posts' => [
            ['id' => 1, 'title' => 'First Post', 'content' => 'This is the first post content'],
            ['id' => 2, 'title' => 'Second Post', 'content' => 'This is the second post content'],
            ['id' => 3, 'title' => 'Third Post', 'content' => 'This is the third post content'],
        ]
    ]);
});

Route::post('/posts', function (Request $request) {
    return response()->json([
        'message' => 'Post created successfully!',
        'post' => [
            'id' => rand(4, 100),
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'created_at' => now()
        ]
    ], 201);
});

// Admin routes (superAdmin only)
Route::middleware(['auth:sanctum'])->group(function () {
    // Admin stats and analytics
    Route::get('/admin/stats', function (Request $request) {
        $user = $request->user();
        if ($user->role !== 'superAdmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        return response()->json([
            'totalUsers' => \App\Models\User::count(),
            'totalCompanies' => \App\Models\Company::count(),
            'totalBlogs' => \App\Models\Blog::count(),
            'pendingApprovals' => \App\Models\Company::where('status', 'pending')->count()
        ]);
    });
    
    // Admin activity log
    Route::get('/admin/activity', function (Request $request) {
        $user = $request->user();
        if ($user->role !== 'superAdmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Mock activity data for now
        return response()->json([
            ['id' => 1, 'type' => 'user', 'action' => 'New user registered', 'user' => 'john_doe', 'time' => '2 hours ago'],
            ['id' => 2, 'type' => 'company', 'action' => 'Company submitted', 'user' => 'business_owner', 'time' => '4 hours ago'],
            ['id' => 3, 'type' => 'blog', 'action' => 'Blog post published', 'user' => 'content_creator', 'time' => '6 hours ago']
        ]);
    });
    
    // User management routes
    Route::get('/admin/users', function (Request $request) {
        $user = $request->user();
        if ($user->role !== 'superAdmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $search = $request->get('search');
        $role = $request->get('role');
        
        $query = \App\Models\User::query();
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        if ($role) {
            $query->where('role', $role);
        }
        
        $users = $query->orderBy('created_at', 'desc')->get();
        
        return response()->json(['users' => $users]);
    });
    
    Route::put('/admin/users/{userId}/role', function (Request $request, $userId) {
        $user = $request->user();
        if ($user->role !== 'superAdmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $targetUser = \App\Models\User::findOrFail($userId);
        $newRole = $request->get('role');
        
        if (!in_array($newRole, ['user', 'owner', 'superAdmin'])) {
            return response()->json(['message' => 'Invalid role'], 400);
        }
        
        $targetUser->role = $newRole;
        $targetUser->save();
        
        return response()->json(['message' => 'User role updated successfully']);
    });
    
    Route::delete('/admin/users/{userId}', function (Request $request, $userId) {
        $user = $request->user();
        if ($user->role !== 'superAdmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $targetUser = \App\Models\User::findOrFail($userId);
        
        // Prevent deleting self
        if ($targetUser->id === $user->id) {
            return response()->json(['message' => 'Cannot delete yourself'], 400);
        }
        
        $targetUser->delete();
        
        return response()->json(['message' => 'User deleted successfully']);
    });
    
    // Company moderation routes
    Route::get('/admin/companies', function (Request $request) {
        $user = $request->user();
        if ($user->role !== 'superAdmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $search = $request->get('search');
        $status = $request->get('status');
        
        $query = \App\Models\Company::with('owner'); // Changed from 'user' to 'owner'
        
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }
        
        if ($status) {
            $query->where('status', $status);
        }
        
        $companies = $query->orderBy('created_at', 'desc')->get();
        
        return response()->json(['companies' => $companies]);
    });
    
    Route::put('/admin/companies/{companyId}/approve', function (Request $request, $companyId) {
        $user = $request->user();
        if ($user->role !== 'superAdmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $company = \App\Models\Company::findOrFail($companyId);
        $company->status = 'approved';
        $company->save();
        
        return response()->json(['message' => 'Company approved successfully']);
    });
    
    Route::put('/admin/companies/{companyId}/reject', function (Request $request, $companyId) {
        $user = $request->user();
        if ($user->role !== 'superAdmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $company = \App\Models\Company::findOrFail($companyId);
        $company->status = 'rejected';
        $company->save();
        
        return response()->json(['message' => 'Company rejected successfully']);
    });

    // Analytics Routes
    Route::prefix('admin/analytics')->group(function () {
        Route::get('/overview', function (Request $request) {
            $user = $request->user();
            if ($user->role !== 'superAdmin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            return response()->json([
                'totalUsers' => \App\Models\User::count(),
                'totalCompanies' => \App\Models\Company::count(),
                'totalRevenue' => 45230, // Mock data
                'avgSessionTime' => 4.2,
                'conversionRate' => 3.4,
                'bounceRate' => 42.1
            ]);
        });

        Route::get('/users', function (Request $request) {
            $user = $request->user();
            if ($user->role !== 'superAdmin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            // Mock user engagement data
            return response()->json([
                'activeUsers' => 2847,
                'newUsers' => 156,
                'returningUsers' => 2691,
                'userGrowth' => 12.5,
                'sessionDuration' => 4.2,
                'pageViews' => 85000,
                'engagementRate' => 68.5
            ]);
        });

        Route::get('/companies', function (Request $request) {
            $user = $request->user();
            if ($user->role !== 'superAdmin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            // Mock company analytics
            return response()->json([
                'totalCompanies' => \App\Models\Company::count(),
                'approvedCompanies' => \App\Models\Company::where('status', 'approved')->count(),
                'pendingCompanies' => \App\Models\Company::where('status', 'pending')->count(),
                'rejectedCompanies' => \App\Models\Company::where('status', 'rejected')->count(),
                'companiesGrowth' => 8.2,
                'averageViews' => 1250,
                'topCategories' => [
                    ['name' => 'Technology', 'count' => 45],
                    ['name' => 'Marketing', 'count' => 32],
                    ['name' => 'Finance', 'count' => 28],
                    ['name' => 'Healthcare', 'count' => 21]
                ]
            ]);
        });

        Route::get('/traffic', function (Request $request) {
            $user = $request->user();
            if ($user->role !== 'superAdmin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            // Mock traffic data
            return response()->json([
                'totalVisits' => 125000,
                'uniqueVisitors' => 45000,
                'pageViews' => 285000,
                'bounceRate' => 42.1,
                'avgSessionDuration' => 4.2,
                'trafficSources' => [
                    ['name' => 'Direct', 'value' => 35, 'visitors' => 15750],
                    ['name' => 'Search', 'value' => 45, 'visitors' => 20250],
                    ['name' => 'Social', 'value' => 15, 'visitors' => 6750],
                    ['name' => 'Referral', 'value' => 5, 'visitors' => 2250]
                ],
                'topPages' => [
                    ['page' => '/companies', 'views' => 45000],
                    ['page' => '/blogs', 'views' => 32000],
                    ['page' => '/', 'views' => 28000],
                    ['page' => '/dashboard', 'views' => 18000]
                ]
            ]);
        });

        Route::get('/revenue', function (Request $request) {
            $user = $request->user();
            if ($user->role !== 'superAdmin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            // Mock revenue data
            return response()->json([
                'totalRevenue' => 45230,
                'monthlyRevenue' => [
                    ['month' => 'Jan', 'revenue' => 12000],
                    ['month' => 'Feb', 'revenue' => 15000],
                    ['month' => 'Mar', 'revenue' => 18000],
                    ['month' => 'Apr', 'revenue' => 22000],
                    ['month' => 'May', 'revenue' => 25000],
                    ['month' => 'Jun', 'revenue' => 28000]
                ],
                'revenueGrowth' => 15.3,
                'averageOrderValue' => 125.50,
                'conversionRate' => 3.4,
                'topRevenueSources' => [
                    ['source' => 'Premium Listings', 'revenue' => 25000],
                    ['source' => 'Advertisements', 'revenue' => 15000],
                    ['source' => 'Subscriptions', 'revenue' => 5230]
                ]
            ]);
        });

        Route::get('/timeseries', function (Request $request) {
            $user = $request->user();
            if ($user->role !== 'superAdmin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            $metric = $request->get('metric', 'users');
            $period = $request->get('period', '30d');
            
            // Mock time series data
            $data = [];
            $days = $period === '7d' ? 7 : ($period === '30d' ? 30 : 90);
            
            for ($i = $days; $i >= 0; $i--) {
                $date = now()->subDays($i);
                $data[] = [
                    'name' => $date->format('M d'),
                    'value' => rand(100, 1000)
                ];
            }
            
            return response()->json($data);
        });

        Route::get('/top-performers', function (Request $request) {
            $user = $request->user();
            if ($user->role !== 'superAdmin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            // Mock top performers data
            return response()->json([
                'companies' => [
                    ['name' => 'TechCorp Inc', 'category' => 'Technology', 'views' => 12500, 'engagement' => 8.5, 'growth' => 15.2],
                    ['name' => 'Green Solutions', 'category' => 'Environment', 'views' => 9800, 'engagement' => 7.2, 'growth' => 12.1],
                    ['name' => 'Digital Marketing Pro', 'category' => 'Marketing', 'views' => 8200, 'engagement' => 6.8, 'growth' => -2.3],
                    ['name' => 'Finance Plus', 'category' => 'Finance', 'views' => 7800, 'engagement' => 6.1, 'growth' => 8.7],
                    ['name' => 'Health First', 'category' => 'Healthcare', 'views' => 6900, 'engagement' => 5.9, 'growth' => 5.4]
                ],
                'content' => [
                    ['name' => 'How to Start a Business', 'category' => 'Business', 'views' => 15200, 'engagement' => 9.2, 'growth' => 18.5],
                    ['name' => 'Digital Marketing Guide', 'category' => 'Marketing', 'views' => 12800, 'engagement' => 8.7, 'growth' => 14.2],
                    ['name' => 'Tech Trends 2025', 'category' => 'Technology', 'views' => 11500, 'engagement' => 7.9, 'growth' => 8.3],
                    ['name' => 'Investment Tips', 'category' => 'Finance', 'views' => 9200, 'engagement' => 7.1, 'growth' => 6.8],
                    ['name' => 'Startup Success Stories', 'category' => 'Business', 'views' => 8600, 'engagement' => 6.8, 'growth' => 12.1]
                ]
            ]);
        });

        Route::get('/geographic', function (Request $request) {
            $user = $request->user();
            if ($user->role !== 'superAdmin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            // Mock geographic data
            return response()->json([
                'countries' => [
                    ['name' => 'United States', 'users' => 1200, 'percentage' => 42.1],
                    ['name' => 'United Kingdom', 'users' => 450, 'percentage' => 15.8],
                    ['name' => 'Canada', 'users' => 320, 'percentage' => 11.2],
                    ['name' => 'Australia', 'users' => 280, 'percentage' => 9.8],
                    ['name' => 'Germany', 'users' => 250, 'percentage' => 8.8],
                    ['name' => 'France', 'users' => 200, 'percentage' => 7.0],
                    ['name' => 'Others', 'users' => 147, 'percentage' => 5.3]
                ]
            ]);
        });

        Route::get('/export', function (Request $request) {
            $user = $request->user();
            if ($user->role !== 'superAdmin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            $type = $request->get('type', 'overview');
            $format = $request->get('format', 'csv');
            
            // Mock CSV export
            $csvData = "Date,Metric,Value\n";
            $csvData .= "2025-01-01,Users,1200\n";
            $csvData .= "2025-01-02,Users,1250\n";
            $csvData .= "2025-01-03,Users,1180\n";
            
            return response($csvData)
                ->header('Content-Type', 'text/csv')
                ->header('Content-Disposition', 'attachment; filename="analytics-export.csv"');
        });
    });
});
