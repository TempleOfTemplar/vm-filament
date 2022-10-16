<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SocialController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ToyController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

//Route::get('/', function () {
//    return Inertia::render('Welcome', [
//        'canLogin' => Route::has('login'),
//        'canRegister' => Route::has('register'),
//        'laravelVersion' => Application::VERSION,
//        'phpVersion' => PHP_VERSION,
//    ]);
//});



//Route::get('/dashboard', function () {
//    return Inertia::render('Dashboard');
//})->middleware(['auth', 'verified'])->name('dashboard');

//require __DIR__.'/auth.php';
//Route::middleware('auth:sanctum')->get('user', function (Request $request) {
//    return $request->user();
//});
Route::controller(SocialController::class)->group(function () {
    Route::get('vk/auth/callback', 'loginWithVkontakte');
    Route::get('vk/auth', 'vkontakteRedirect')->name('auth.vk');

    Route::get('google/auth/callback', 'loginWithGoogle');
    Route::get('google/auth', 'googleRedirect')->name('auth.google');
});

Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api).*$');

//Route::get('/tasks', [TaskController::class, 'index'])->name('tasks') ->middleware(['auth', 'verified']);
//Route::get('/tasks/my', [TaskController::class, 'myTasks'])->name('tasks.my') ->middleware(['auth', 'verified']);
//Route::get('/tasks/favorite', [TaskController::class, 'favoritedTasks'])->name('tasks.favorite') ->middleware(['auth', 'verified']);
//Route::get('/tasks/add', [TaskController::class, 'create'])->name('tasks.add') ->middleware(['auth', 'verified']);
//Route::get('/tasks/edit', [TaskController::class, 'edit'])->name('tasks.edit') ->middleware(['auth', 'verified']);
//Route::get('/tasks/{task}', [TaskController::class, 'show'])->name('tasks.show') ->middleware(['auth', 'verified']);
//Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.save') ->middleware(['auth', 'verified']);

//Route::resource('tasks', TaskController::class)->middleware(['auth', 'verified']);
//Route::resource('toys', ToyController::class)->middleware(['auth', 'verified']);
//Route::resource('categories', CategoryController::class)->middleware(['auth', 'verified']);
//Route::resource('tags', TagController::class)->middleware(['auth', 'verified']);

//Auth::routes();

//Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
