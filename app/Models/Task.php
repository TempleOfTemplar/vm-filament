<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Overtrue\LaravelFavorite\Traits\Favoriteable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Tags\HasTags;

class Task extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, HasTags, Favoriteable;

    protected $fillable = [
        'title',
        'excerpt',
        'category_id',
        'author_id',
        'slug',
        'content',
        'is_published'
    ];
    protected $casts = [
        'is_published' => 'boolean'
    ];


    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function toys()
    {
        return $this->belongsToMany(Toy::class, 'task_toy');
    }


    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    protected $with = [];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->author_id = Auth::id();
        });

        static::updating(function ($model) {
            $model->author_id = Auth::id();
        });
    }

}
