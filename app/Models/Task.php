<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Task extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

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
        'is_published' => 'boolean',
        'tagsList' => 'array',
        'toysList' => 'array'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function toys()
    {
        return $this->belongsToMany(Toy::class, 'task_toy');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'task_tag');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

}
