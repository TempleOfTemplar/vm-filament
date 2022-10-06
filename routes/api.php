<?php

use App\Http\Controllers\API\TaskAPIController;
use App\Http\Controllers\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/tasks/attachImage', [TaskAPIController::class, 'attachImage'])->name('tasks.attachImage') ->middleware(['auth', 'verified']);
Route::patch('/tasks/favorite/{task}', [TaskAPIController::class, 'setTaskFavorite'])->name('tasks.setFavorite') ->middleware(['auth', 'verified']);
Route::get('/tasks/my', [TaskAPIController::class, 'myTasks'])->name('tasks.my') ->middleware(['auth', 'verified']);
Route::resource('tasks', App\Http\Controllers\API\TaskAPIController::class);

Route::resource('toys', App\Http\Controllers\API\ToyAPIController::class)
    ->except(['create', 'edit']);

Route::resource('categories', App\Http\Controllers\API\CategoryAPIController::class)
    ->except(['create', 'edit']);

Route::resource('tags', App\Http\Controllers\API\TagAPIController::class)
    ->except(['create', 'edit']);

