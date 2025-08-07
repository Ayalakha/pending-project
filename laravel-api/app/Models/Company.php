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

    // Helper methods
    public function isOwnedBy(User $user)
    {
        return $this->owner_id === $user->id;
    }
}
