<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Models\Category;
use App\Models\Task;
use App\Models\Toy;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

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
        $tasks = Task::query()
            ->when($searchQuery, function ($query, $search) {
                $query->where('title', 'like', '%' . $search . '%')
                    ->OrWhere('excerpt', 'like', '%' . $search . '%');
            })->when($toysFilter, function ($query, $toysFilter) {
                $query->whereHas('toys', function ($query) use ($toysFilter) {
                    $query->whereIn('toy_id', $toysFilter);
                });
            })->with('toys')->with('category')->with('tags')->with('author');
        $categories = Category::all();
        $toys = Toy::all();
        return Inertia::render('Task/ListTasks', ['tasks' => $tasks->get(), 'toys' => $toys, 'categories' => $categories]);
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
        return Inertia::render('Task/CreateTask', ['toys' => $toys, 'categories' => $categories]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreTaskRequest $request)
    {
        $toys = $request->toys;
        $categories = $request->categories;
        $createdTask = Task::create(
            array_merge($request->validated(), ['author_id' => Auth::user()->getAuthIdentifier()])
        );
        $createdTask->toys()->attach($toys);
        $createdTask->categories()->attach($categories);
        return Redirect::route('tasks.index');
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Task $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        //
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

        return Redirect::route('tasks.index');
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

        return Redirect::route('tasks.index');
    }
}
