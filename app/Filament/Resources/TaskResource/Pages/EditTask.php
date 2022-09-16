<?php

namespace App\Filament\Resources\TaskResource\Pages;

use App\Filament\Resources\TaskResource;
use Filament\Pages\Actions;
use Filament\Resources\Pages\EditRecord;

class EditTask extends EditRecord
{
    protected static string $resource = TaskResource::class;

    protected function getActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    public function mount($record): void
    {
        $this->record = $this->resolveRecord($record);

        $this->authorizeAccess();

        $this->callHook('beforeFill');

        $data = $this->getRecord()->attributesToArray();
        if ($data['content']) {
            $data['content'] = json_decode($data['content'], true);
        }
        $data = $this->mutateFormDataBeforeFill($data);

        $this->form->fill($data);

        $this->callHook('afterFill');
    }


}
