<?php

namespace App\Models;

use FilamentCurator\Models\Media;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Toy extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'slug',
        'image'
    ];

    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'task_toy');
    }

    protected $with = ['image'];

    public function image(): HasOne
    {
        return $this->hasOne(Media::class, 'id', 'image');
    }
}
