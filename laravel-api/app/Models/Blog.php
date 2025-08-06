<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'company_id',
    ];

    // Relationships
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Helper methods
    public function isOwnedBy(User $user)
    {
        return $this->company->isOwnedBy($user);
    }

    public function getExcerptAttribute()
    {
        return substr($this->content, 0, 150) . '...';
    }
}
