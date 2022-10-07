<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\API\CreateToyAPIRequest;
use App\Http\Requests\API\UpdateToyAPIRequest;
use App\Models\Toy;
use App\Repositories\ToyRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\AppBaseController;

/**
 * Class ToyAPIController
 */
class ToyAPIController extends AppBaseController
{
    private ToyRepository $toyRepository;

    public function __construct(ToyRepository $toyRepo)
    {
        $this->toyRepository = $toyRepo;
    }

    /**
     * Display a listing of the Toys.
     * GET|HEAD /toys
     */
    public function index(Request $request): JsonResponse
    {
        $toys = $this->toyRepository->all(
            $request->except(['skip', 'limit']),
            $request->get('skip'),
            $request->get('limit')
        );

        return $this->sendResponse($toys->toArray(), 'Toys retrieved successfully');
    }

    /**
     * Store a newly created Toy in storage.
     * POST /toys
     */
    public function store(CreateToyAPIRequest $request): JsonResponse
    {
        $input = $request->all();

        $toy = $this->toyRepository->create($input);

        return $this->sendResponse($toy->toArray(), 'Toy saved successfully');
    }

    /**
     * Display the specified Toy.
     * GET|HEAD /toys/{id}
     */
    public function show($id): JsonResponse
    {
        /** @var Toy $toy */
        $toy = $this->toyRepository->find($id);

        if (empty($toy)) {
            return $this->sendError('Toy not found');
        }

        return $this->sendResponse($toy->toArray(), 'Toy retrieved successfully');
    }

    /**
     * Update the specified Toy in storage.
     * PUT/PATCH /toys/{id}
     */
    public function update($id, UpdateToyAPIRequest $request): JsonResponse
    {
        $input = $request->all();

        /** @var Toy $toy */
        $toy = $this->toyRepository->find($id);

        if (empty($toy)) {
            return $this->sendError('Toy not found');
        }

        $toy = $this->toyRepository->update($input, $id);

        return $this->sendResponse($toy->toArray(), 'Toy updated successfully');
    }

    /**
     * Remove the specified Toy from storage.
     * DELETE /toys/{id}
     *
     * @throws \Exception
     */
    public function destroy($id): JsonResponse
    {
        /** @var Toy $toy */
        $toy = $this->toyRepository->find($id);

        if (empty($toy)) {
            return $this->sendError('Toy not found');
        }

        $toy->delete();

        return $this->sendSuccess('Toy deleted successfully');
    }
}
