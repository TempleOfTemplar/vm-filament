<?php

namespace App\Providers;
use App\Actions\MediaActions;
use Illuminate\Support\Facades\App;
use Illuminate\Support\ServiceProvider;

class LaravelMediaServiceProvider extends ServiceProvider
{
    public function boot()
    {
    }

    public function register() {
        App::bind('media-actions',function() {
            return new MediaActions();
        });
    }
}
