<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Toy extends Model implements HasMedia
{

    use InteractsWithMedia, HasFactory;

//    public function registerMediaConversions(Media $media = null): void
//    {
//        $this
//            ->addMediaConversion('thumbnail')
//            ->fit(Manipulations::FIT_CROP, 300, 300)
//            ->nonQueued();
//    }

    public $table = 'toys';

    public $fillable = [
        'title',
        'description',
        'slug',
        'image'
    ];

    protected $casts = [
        'title' => 'string',
        'description' => 'string',
        'slug' => 'string',
        'image' => 'string'
    ];

    public static $rules = [
        'title' => 'required|string',
        'description' => 'nullable|string',
        'slug' => 'required|string',
        'created_at' => 'nullable',
        'updated_at' => 'nullable',
        'image' => 'nullable|string'
    ];

    public function tasks(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(\App\Models\Task::class, 'task_toy');
    }

    public function registerMediaCollections(): void
    {
        $this
            ->addMediaCollection('toys')
            ->singleFile();

        $this
            ->addMediaCollection('tasks_images');
    }

//    protected $with = ['image'];
//
//    public function image(): HasOne
//    {
//        return $this->hasOne(Media::class, 'id', 'image');
//    }
}
