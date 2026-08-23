<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMechanicRequest;
use App\Http\Requests\UpdateMechanicRequest;
use App\Models\Mechanic;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MechanicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $mechanics = Mechanic::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('MasterData/Mechanics/Index', [
            'mechanics' => $mechanics,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('MasterData/Mechanics/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreMechanicRequest $request
    ): RedirectResponse {
        Mechanic::create($request->validated());

        return to_route('mechanics.index')
            ->with('success', 'Mekanik berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(mechanic $mechanic): Response
    {
        return Inertia::render('MasterData/Mechanics/Show', [
            'mechanic' => $mechanic,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(mechanic $mechanic): Response
    {
        return Inertia::render('MasterData/Mechanics/Edit', [
            'mechanic' => $mechanic,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateMechanicRequest $request,
        mechanic $mechanic
    ): RedirectResponse {
        $mechanic->update($request->validated());

        return to_route('mechanics.index')
            ->with('success', 'Mekanik berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(mechanic $mechanic): RedirectResponse
    {
        $mechanic->delete();

        return to_route('mechanics.index')
            ->with('success', 'Mekanik berhasil dihapus.');
    }
}
