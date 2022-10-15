<?php

use App\Http\Controllers\API\Auth\AuthController;
use App\Http\Controllers\API\TaskAPIController;
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
Route::post('/login', [AuthController::class,'authenticate']);
Route::post('/register', [AuthController::class,'register']);

Route::group(['middleware' => 'auth:sanctum'], function() {
    Route::get('/auth/user', function (Request $request) {
        return ['data' => $request->user()];
    });
    Route::delete('/logout', [AuthController::class,'logout']);
});

Route::post('/tasks/attachImage', [TaskAPIController::class, 'attachImage'])->name('tasks.attachImage') ->middleware(['auth', 'verified']);
Route::patch('/tasks/{task}/favorite', [TaskAPIController::class, 'setTaskFavorite'])->name('tasks.setFavorite') ->middleware(['auth', 'verified']);
Route::patch('/tasks/{task}/like', [TaskAPIController::class, 'setTaskLiked'])->name('tasks.setLiked') ->middleware(['auth', 'verified']);

Route::get('/tasks/my', [TaskAPIController::class, 'myTasks'])->name('tasks.my') ->middleware(['auth', 'verified']);
Route::get('/tasks/favorite', [TaskAPIController::class, 'favoriteTasks'])->name('tasks.favorite') ->middleware(['auth', 'verified']);
Route::resource('tasks', App\Http\Controllers\API\TaskAPIController::class)
    ->except(['create', 'edit']);;

Route::resource('toys', App\Http\Controllers\API\ToyAPIController::class)
    ->except(['create', 'edit']);

Route::resource('categories', App\Http\Controllers\API\CategoryAPIController::class)
    ->except(['create', 'edit']);

Route::resource('tags', App\Http\Controllers\API\TagAPIController::class)
    ->except(['create', 'edit']);

