<?php

namespace App\Http\Controllers\API;

use App\Facades\MediaFacade as Media;
use App\Http\Controllers\AppBaseController;
use App\Http\Requests\API\CreateTaskAPIRequest;
use App\Http\Requests\API\UpdateTaskAPIRequest;
use App\Models\Task;
use App\Repositories\TaskRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

/**
 * Class TaskAPIController
 */
class TaskAPIController extends AppBaseController
{
    private TaskRepository $taskRepository;

    public function __construct(TaskRepository $taskRepo)
    {
        $this->taskRepository = $taskRepo;
    }

    /**
     * Display a listing of the Tasks.
     * GET|HEAD /tasks
     */
    public function index(Request $request): CursorPaginator
    {
        $searchQuery = $request->input('search');
        $toysFilter = $request->input('toys');
        $tagsFilter = $request->input('tags');
        $cursor = $request->input('cursor');

        $tasks = Task::withCount('likers')
            ->where("is_published", 1)
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
            ->orderBy('id')
//            ->load(['toys','category','tags','author','comments'])
            ->cursorPaginate(15, ['*'], 'cursor', $cursor);
//            ->with('toys')
//            ->with('category')
//            ->with('tags')
//            ->with('author')
//            ->with('comments')
//        $tasks = Auth::user()->attachFavoriteStatus($tasks);
//        $tasks = Auth::user()->attachLikeStatus($tasks);
        return $tasks;
    }

    public function myTasks()
    {
        $tasks = Task::query()->where("author_id", '=', Auth::id())
            ->with('toys')
            ->with('category')
            ->with('tags')
            ->with('author')
            ->get();
        return $this->sendResponse($tasks->toArray(), 'My tasks retrieved successfully');
    }

    public function favoriteTasks()
    {
        $favoritedTasks = Auth::user()->getFavoriteItems(Task::class)->where("is_published", 1)->get();
        return $this->sendResponse($favoritedTasks->toArray(), 'Favorited tasks retrieved successfully');
    }


    public function setTaskFavorite(Task $task)
    {
        Auth::user()->toggleFavorite($task);
        Auth::user()->attachFavoriteStatus($task);
        // $task = $task->with('likes');
        return $this->sendResponse($task->toArray(), 'Task favorited successfully');
    }

    public function setTaskLiked(Task $task)
    {
        Auth::user()->toggleLike($task);
        Auth::user()->attachFavoriteStatus($task);
        Auth::user()->attachLikeStatus($task);
        // $task = $task->with('likes');
        return $this->sendResponse($task->toArray(), 'Task liked successfully');
    }

    /**
     * Store a newly created Task in storage.
     * POST /tasks
     */
    public function store(CreateTaskAPIRequest $request): JsonResponse
    {
        $tags = $request->input("tags");
        $toys = $request->input("toys");
        $task = new Task;
        $task->title = $request->input("title");
        $task->slug = Str::slug($request->input("title"));
        $task->excerpt = $request->input("excerpt");
        $task->category_id = $request->input("category_id");
        $task->author_id = Auth::id();
        $task->content = $request->input("content");
        $task->save();
        $task->toys()->sync($toys);
        $task->tags()->sync($tags);
        // $task = $this->taskRepository->create($input);

        return $this->sendResponse($task->toArray(), 'Task saved successfully');
    }

    /**
     * Display the specified Task.
     * GET|HEAD /tasks/{id}
     */
    public function show($id): JsonResponse
    {
        /** @var Task $task */
        $task = $this->taskRepository->find($id);

        if (empty($task)) {
            return $this->sendError('Task not found');
        }
        $taskToReturn = $task->load(['tags', 'category', 'toys', 'author', 'comments']);
        Auth::user()->attachLikeStatus($taskToReturn);
        Auth::user()->attachFavoriteStatus($task);
        return $this->sendResponse($taskToReturn->toArray(), 'Task retrieved successfully');
    }

    /**
     * Display the specified Task.
     * GET|HEAD /tasks/{id}
     */
    public function attachImage(Request $request): JsonResponse
    {
        $media = Media::usingResource()->upload($request->file('image'));
        return $this->sendResponse($media, 'Task retrieved successfully');
    }

    public function addComment(Request $request): JsonResponse
    {
        $taskId = $request->input('taskId');
        $comment = $request->input('comment');
        $task = $this->taskRepository->find($taskId);

        if (empty($task)) {
            return $this->sendError(`Task with id ${$taskId} not found`);
        }

        $addedComment = $task->comment($comment);
        // $taskToReturn = $task->load(['tags', 'category', 'toys', 'author', 'comments']);
        return $this->sendResponse($addedComment, 'Comment added successfully');
    }

    public function getComments(Task $task): JsonResponse
    {
//        dd($task);

        $comments = [];//pluck('comments')->collapse();;
        foreach ($task->comments as $comment) {
            array_push($comments, $comment);
            // working with comment here...
        }
        return $this->sendResponse($task->comments, 'Comments retrieved successfully');
    }

    /**
     * Update the specified Task in storage.
     * PUT/PATCH /tasks/{id}
     */
    public function update($id, UpdateTaskAPIRequest $request): JsonResponse
    {
        /** @var Task $task */
        $task = $this->taskRepository->find($id);

        if (empty($task)) {
            return $this->sendError('Task not found');
        }
        $tags = $request->input("tags");
        $toys = $request->input("toys");
        $task->title = $request->input("title");
        $task->slug = Str::slug($request->input("title"));
        $task->excerpt = $request->input("excerpt");
        $task->category_id = $request->input("category_id");
        $task->author_id = Auth::id();
        $task->content = $request->input("content");
        $task->save();
        $task->toys()->sync($toys);
        $task->tags()->sync($tags);
        // $task = $this->taskRepository->update($input, $id);

        return $this->sendResponse($task, 'Task updated successfully');
    }

    /**
     * Remove the specified Task from storage.
     * DELETE /tasks/{id}
     *
     * @throws \Exception
     */
    public function destroy($id): JsonResponse
    {
        /** @var Task $task */
        $task = $this->taskRepository->find($id);

        if (empty($task)) {
            return $this->sendError('Task not found');
        }

        $task->delete();

        return $this->sendSuccess('Task deleted successfully');
    }
}
