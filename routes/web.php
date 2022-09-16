<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ToyController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/auth.php';

Route::controller(SocialController::class)->group(function () {
    Route::get('vk/auth/callback', 'loginWithVkontakte');
    Route::get('vk/auth', 'vkontakteRedirect')->name('auth.vk');

    Route::get('google/auth/callback', 'loginWithGoogle');
    Route::get('google/auth', 'googleRedirect')->name('auth.google');
});

Route::resource('tasks', TaskController::class)->middleware(['auth', 'verified']);
Route::resource('toys', ToyController::class)->middleware(['auth', 'verified']);
Route::resource('categories', CategoryController::class)->middleware(['auth', 'verified']);
Route::resource('tags', TagController::class)->middleware(['auth', 'verified']);
