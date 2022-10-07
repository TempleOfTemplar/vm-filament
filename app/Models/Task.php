<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Overtrue\LaravelFavorite\Traits\Favoriteable;
use Overtrue\LaravelLike\Traits\Likeable;
use RyanChandler\Comments\Concerns\HasComments;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Tags\HasTags;
use willvincent\Rateable\Rateable;

class Task extends Model implements HasMedia
{
    use HasTags, Favoriteable, InteractsWithMedia, HasComments, Likeable, Rateable;

    public $table = 'tasks';

    public $fillable = [
        'title',
        'excerpt',
        'category_id',
        'content'
    ];

    protected $casts = [
        'title' => 'string',
        'excerpt' => 'string',
        'slug' => 'string',
        'content' => 'string',
        'is_published' => 'boolean'
    ];

    public static $rules = [
        'title' => 'required|string',
        'excerpt' => 'required|string',
        'category_id' => 'required',
        'slug' => 'string',
        'content' => 'required|string',
        'is_published' => 'boolean',
        'created_at' => 'nullable',
        'updated_at' => 'nullable'
    ];

    public function category(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(\App\Models\Category::class, 'category_id');
    }

    public function author(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'author_id');
    }

    public function toys(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(\App\Models\Toy::class, 'task_toy');
    }


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
