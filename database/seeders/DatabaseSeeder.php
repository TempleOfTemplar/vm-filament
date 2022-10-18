<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Tag;
use App\Models\Task;
use App\Models\Toy;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $maxUsersToGenerate = 10;
        $maxToysToGenerate = 30;
        $maxTagsToGenerate = 10;

        $users = User::factory($maxUsersToGenerate)->create();
        $tags = Tag::factory($maxTagsToGenerate)->create();
        $toys = Toy::factory($maxToysToGenerate)->create();
//         User::factory(10)->create()->each(function($user) {
//             // $foo->bars()->save(factory(App\Bar::class)->make());
//         });
//         Task::factory(1000)->create()->each(function($task) {
//             $foo->bars()->save(factory(App\Bar::class)->make());
//         });

        $tagIds = $tags->pluck('id')->toArray();
        $toyIds = $toys->pluck('id')->toArray();

        // randomElements

        $users->each(function ($user) use ($tagIds, $toyIds) {
            Task::factory(rand(1, 200))->create()->each(function ($task) use ($user, $tagIds, $toyIds) {

                $selectedToyIds = Arr::random($toyIds, rand(1, count($toyIds)));
                $selectedTagIds = Arr::random($tagIds, rand(1, count($tagIds)));
                $task->is_published = true;
                $task->save();

                $latest_task = Task::latest()->first();
                $latest_task->tags()->syncWithoutDetaching($selectedTagIds);
                $latest_task->toys()->syncWithoutDetaching($selectedToyIds);

            });
//             $foo->bars()->save(factory(App\Bar::class)->make());
//         });
            // With dummy questions
//            $user->tags()->saveMany(factory(App\Question::class, 3)
//                ->create(['user_id' => $user->id])->each(function($question) use($tagIds)
//                {
//                    // With dummy tags
//                    $question->tags()->sync(array_random($tagIds, mt_rand(1, 5)));
//                }));
        });

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
