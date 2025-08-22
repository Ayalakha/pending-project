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
        'rc', // Registre de Commerce (Moroccan business registration)
        'legal_form',
        'owner_id',
        'status',
        'city', // Moroccan city
        'region', // Moroccan region
        'ice', // Identifiant Commun de l'Entreprise (Moroccan tax ID)
        'cnss', // Caisse Nationale de Sécurité Sociale number
        'patent_number', // Patente (Moroccan business license)
        'activity_sector', // Sector of activity in Morocco
        'incorporation_date',
        'is_verified',
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

    public function getFormattedCapitalAttribute()
    {
        return number_format($this->capital, 2) . ' MAD';
    }

    public function getMoroccanLegalFormsAttribute()
    {
        return [
            'SA' => 'Société Anonyme',
            'SARL' => 'Société à Responsabilité Limitée',
            'SARL_AU' => 'SARL à Associé Unique',
            'SNC' => 'Société en Nom Collectif',
            'SCS' => 'Société en Commandite Simple',
            'SCA' => 'Société en Commandite par Actions',
            'EP' => 'Établissement Public',
            'GIE' => 'Groupement d\'Intérêt Économique',
            'EI' => 'Entreprise Individuelle',
        ];
    }

    public function getMoroccanRegionsAttribute()
    {
        return [
            'Tanger-Tétouan-Al Hoceïma',
            'L\'Oriental',
            'Fès-Meknès',
            'Rabat-Salé-Kénitra',
            'Béni Mellal-Khénifra',
            'Casablanca-Settat',
            'Marrakech-Safi',
            'Drâa-Tafilalet',
            'Souss-Massa',
            'Guelmim-Oued Noun',
            'Laâyoune-Sakia El Hamra',
            'Dakhla-Oued Ed-Dahab',
        ];
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
