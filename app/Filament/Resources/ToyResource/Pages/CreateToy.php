<?php

namespace App\Filament\Resources\ToyResource\Pages;

use App\Filament\Resources\ToyResource;
use Filament\Resources\Pages\CreateRecord;

class CreateToy extends CreateRecord
{
    protected static string $resource = ToyResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
