<?php

namespace App\Http\Controllers;

use App\Models\Toy;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ToyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $toys = Toy::all();
        return Inertia::render('Toy/ListToys', ['toys' => $toys]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Toy  $toy
     * @return \Illuminate\Http\Response
     */
    public function show(Toy $toy)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Toy  $toy
     * @return \Illuminate\Http\Response
     */
    public function edit(Toy $toy)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Toy  $toy
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Toy $toy)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Toy  $toy
     * @return \Illuminate\Http\Response
     */
    public function destroy(Toy $toy)
    {
        //
    }
}
