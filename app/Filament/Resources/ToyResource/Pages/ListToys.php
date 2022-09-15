<?php

namespace App\Filament\Resources\ToyResource\Pages;

use App\Filament\Resources\ToyResource;
use Filament\Pages\Actions;
use Filament\Resources\Pages\ListRecords;

class ListToys extends ListRecords
{
    protected static string $resource = ToyResource::class;

    protected function getActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
