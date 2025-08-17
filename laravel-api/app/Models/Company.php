<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'logo',
        'website',
        'phone_number',
        'capital',
        'rc',
        'legal_form',
        'owner_id',
    ];

    // Relationships
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function servicesOrProducts()
    {
        return $this->hasMany(ServiceOrProduct::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function approvedReviews()
    {
        return $this->hasMany(Review::class)->approved();
    }

    // Helper methods
    public function isOwnedBy(User $user)
    {
        return $this->owner_id === $user->id;
    }

    public function getAverageRatingAttribute()
    {
        return $this->approvedReviews()->avg('rating') ?? 0;
    }

    public function getTotalReviewsAttribute()
    {
        return $this->approvedReviews()->count();
    }

    public function getRatingDistributionAttribute()
    {
        $distribution = [];
        for ($i = 1; $i <= 5; $i++) {
            $distribution[$i] = $this->approvedReviews()->where('rating', $i)->count();
        }
        return $distribution;
    }
}
