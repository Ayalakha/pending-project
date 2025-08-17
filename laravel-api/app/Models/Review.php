<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'user_id',
        'company_id',
        'rating',
        'title',
        'comment',
        'is_verified',
        'is_approved',
        'helpful_votes'
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'is_approved' => 'boolean',
        'helpful_votes' => 'array',
        'rating' => 'integer'
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopeByRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    // Helper methods
    public function getHelpfulVotesCountAttribute()
    {
        return is_array($this->helpful_votes) ? count($this->helpful_votes) : 0;
    }

    public function isHelpfulTo($userId)
    {
        return is_array($this->helpful_votes) && in_array($userId, $this->helpful_votes);
    }
}
