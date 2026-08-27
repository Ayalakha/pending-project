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
        'image',
        'external_source_url',
        'user_id',
        'status',
        'moderation_notes',
        'moderated_by',
        'moderated_at',
    ];

    // Relationships
    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function moderatedBy()
    {
        return $this->belongsTo(User::class, 'moderated_by');
    }

    // Helper methods
    public function isOwnedBy(User $user)
    {
        return $this->user_id === $user->id;
    }

    public function getExcerptAttribute()
    {
        return substr($this->content, 0, 150) . '...';
    }
}
