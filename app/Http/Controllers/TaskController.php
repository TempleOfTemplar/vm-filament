<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Models\Category;
use App\Models\Task;
use App\Models\Toy;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Tags\Tag;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $searchQuery = Request::input('search');
        $toysFilter = Request::input('toys');
        $tagsFilter = Request::input('tags');
        $tasks = Task::query()
            ->where("is_published",1)
            ->when($searchQuery, function ($query, $search) {
                $query->where('title', 'like', '%' . $search . '%')
                    ->OrWhere('excerpt', 'like', '%' . $search . '%');
            })->when($toysFilter, function ($query, $toysFilter) {
                $query->whereHas('toys', function ($query) use ($toysFilter) {
                    $query->whereIn('toy_id', $toysFilter);
                });
            })
            ->when($tagsFilter, function ($query, $tagsFilter) {
                $query->whereHas('tags', function ($query) use ($tagsFilter) {
                    $query->whereIn('tag_id', $tagsFilter);
                });
            })
            ->with('toys')
            ->with('category')
            ->with('tags')
            ->with('author')
            ->get();

        $tasks = Auth::user()->attachFavoriteStatus($tasks);
        $categories = Category::all();
        $toys = Toy::all();
        $tags = Tag::all();
        return Inertia::render('Task/ListTasks',
            ['tasks' => $tasks,
                'toys' => $toys,
                'categories' => $categories,
                'tags' => $tags]);
    }

    public function myTasks()
    {
        $tasks = Task::query()->where("author_id", '=',  Auth::id())
            ->with('toys')
            ->with('category')
            ->with('tags')
            ->with('author')
            ->get();
        return Inertia::render('Task/ListMyTasks',
            ['tasks' => $tasks]);
    }

    public function favoritedTasks()
    {
        $favoritedTasks = Auth::user()->getFavoriteItems(Task::class)->where("is_published",1)->get();
        return Inertia::render('Task/FavoritedTasks',
            ['favoritedTasks' => $favoritedTasks]);
    }

    public function setTaskFavorite(Task $task) {
        Auth::user()->toggleFavorite($task);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $categories = Category::all();
        $toys = Toy::all();
        $tags = Tag::all();
        return Inertia::render('Task/CreateTask', ['toys' => $toys, 'categories' => $categories, 'tags' => $tags]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreTaskRequest $request)
    {
        $tags = $request->tags;
        $toys = $request->toys;

        $task = new Task;
        $task->title = $request->input("title");
        $task->slug = Str::slug($request->input("title"));
        $task->excerpt = $request->input("excerpt");
        $task->category_id = $request->input("category");
//        $task->author_id = Auth::id();
        $task->content = json_encode($request->input("content"));
        $task->save();
        $task->toys()->sync($toys);
        $task->syncTags($tags);
        return Redirect::route('tasks');
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Task $task
     * @return \Inertia\Response
     */
    public function show(Task $task)
    {
        $taskToReturn = $task->load(['tags', 'category', 'toys', 'author']);;

        return Inertia::render('Task/ViewTask', ['task' => $taskToReturn]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param \App\Models\Task $task
     * @return \Inertia\Response
     */
    public function edit(Task $task)
    {
        return Inertia::render('Task/EditTask', [
            'task' => $task
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Task $task
     * @return \Illuminate\Http\Response
     */
    public function update(StoreTaskRequest $request, Task $task)
    {
        $task->update($request->validated());

        return Redirect::route('tasks');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Task $task
     * @return \Illuminate\Http\Response
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return Redirect::route('tasks');
    }
}
