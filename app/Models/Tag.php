<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    public $table = 'tags';

    public $fillable = [
        'name',
        'slug',
        'type',
        'order_column'
    ];

    protected $casts = [
        'name' => 'string',
        'slug' => 'string',
        'type' => 'string'
    ];

    public static $rules = [
        'name' => 'required|string',
        'slug' => 'required|string',
        'type' => 'nullable|string',
        'order_column' => 'nullable',
        'created_at' => 'nullable',
        'updated_at' => 'nullable'
    ];

    public function taggables(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Models\Taggable::class, 'tag_id');
    }
}
