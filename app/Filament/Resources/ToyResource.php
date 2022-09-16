<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TagResource\RelationManagers\PostsRelationManager;
use App\Filament\Resources\ToyResource\Pages;
use App\Filament\Resources\ToyResource\RelationManagers;
use App\Models\Toy;
use Closure;
use Filament\Forms\Components\Card;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Support\Str;

class ToyResource extends Resource
{
    protected static ?string $model = Toy::class;

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
                    Textarea::make('description')->default(""),
                    SpatieMediaLibraryFileUpload::make('image')->collection("toys")
                ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->sortable(),
                TextColumn::make('title')->label('название')->sortable(),
                TextColumn::make('slug'),
                SpatieMediaLibraryImageColumn::make('image')->collection("toys"),
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

        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListToys::route('/'),
            'create' => Pages\CreateToy::route('/create'),
            'edit' => Pages\EditToy::route('/{record}/edit'),
        ];
    }
}
