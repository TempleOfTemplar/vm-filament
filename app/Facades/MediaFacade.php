<?php
namespace App\Facades;
use Illuminate\Support\Facades\Facade;

class MediaFacade extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'media-actions';
    }
}
