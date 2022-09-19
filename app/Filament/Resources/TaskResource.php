<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TaskResource\Pages;
use App\Filament\Resources\TaskResource\RelationManagers\TagsRelationManager;
use App\Models\Task;
use App\Models\Toy;
use Closure;
use Filament\Forms\Components\Card;
use Filament\Forms\Components\MultiSelect;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieTagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;
use Filament\Tables\Columns\BooleanColumn;
use Filament\Tables\Columns\SpatieTagsColumn;
use Filament\Tables\Columns\TagsColumn;
use Filament\Tables\Columns\TextColumn;
use FilamentEditorJs\Forms\Components\EditorJs;
use FilamentQuill\Forms\Components\Quill;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class TaskResource extends Resource
{
    protected static ?string $model = Task::class;

    protected static ?string $navigationIcon = 'heroicon-o-collection';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Card::make()->schema([
                    TextInput::make('title')
                        ->required()
                        ->reactive()
                        ->afterStateUpdated(function (Closure $set, $state) {
                            $set('slug', Str::slug($state));
                        }),
                    TextInput::make('slug')->required(),
                    TextInput::make('excerpt'),
                    Select::make('category_id')
                        ->relationship('category', 'title')->required(),
                    MultiSelect::make('toys')
                        ->relationship('toys', 'title')
                        ->options(Toy::all()->pluck('title', 'id')),
                    SpatieTagsInput::make('tags'),
                    // EditorJs::make('content')->fileAttachmentsDisk('public')->required(),
                    Quill::make('content'),
                    Select::make('author_id')
                        ->relationship('author', 'name')
                        ->default(Auth::id()),
                    Toggle::make('is_published')
                ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->sortable(),
                TextColumn::make('title')->label('название')->sortable()->searchable(),
                TextColumn::make('author.name')->label('автор')->sortable()->searchable(),
                TextColumn::make('category.title')->label('категория')->sortable()->searchable(),
                TagsColumn::make('toys.title')->label('инвентарь')->limit(2),
                SpatieTagsColumn::make('tags')->label('теги')->limit(2),
                BooleanColumn::make('is_published')->label('опубликовано')
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            TagsRelationManager::class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTasks::route('/'),
            'create' => Pages\CreateTask::route('/create'),
            'edit' => Pages\EditTask::route('/{record}/edit'),
        ];
    }
}
