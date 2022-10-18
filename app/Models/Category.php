<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    public $table = 'categories';

    public $fillable = [
        'title',
        'slug'
    ];

    protected $casts = [
        'title' => 'string',
        'slug' => 'string'
    ];

    public static $rules = [
        'title' => 'required|string',
        'slug' => 'required|string',
        'created_at' => 'nullable',
        'updated_at' => 'nullable'
    ];

    public function tasks(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Models\Task::class, 'category_id');
    }
}
