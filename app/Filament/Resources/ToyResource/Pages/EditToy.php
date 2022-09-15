<?php

namespace App\Filament\Resources\ToyResource\Pages;

use App\Filament\Resources\ToyResource;
use Filament\Pages\Actions;
use Filament\Resources\Pages\EditRecord;

class EditToy extends EditRecord
{
    protected static string $resource = ToyResource::class;

    protected function getActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
