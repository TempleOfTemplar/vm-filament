<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Task extends Model
{
    public $table = 'tasks';

    public $fillable = [
        'title',
        'excerpt',
        'category_id',
        'author_id',
        'slug',
        'content',
        'is_published'
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
        'author_id' => 'required',
        'slug' => 'required|string',
        'content' => 'required|string',
        'is_published' => 'required|boolean',
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
