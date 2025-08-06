<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ServiceOrProduct extends Model
{
    use HasFactory;

    protected $table = 'services_or_products';

    protected $fillable = [
        'name',
        'description',
        'price',
        'type',
        'company_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    // Relationships
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    // Helper methods
    public function isService()
    {
        return $this->type === 'service';
    }

    public function isProduct()
    {
        return $this->type === 'product';
    }

    public function getFormattedPriceAttribute()
    {
        return '$' . number_format((float)$this->price, 2);
    }
}
