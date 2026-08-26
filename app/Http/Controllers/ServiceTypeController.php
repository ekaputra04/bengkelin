<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceTypeRequest;
use App\Http\Requests\UpdateServiceTypeRequest;
use App\Models\ServiceType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $serviceTypes = ServiceType::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('MasterData/ServiceTypes/Index', [
            'serviceTypes' => $serviceTypes,
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
        return Inertia::render('MasterData/ServiceTypes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreServiceTypeRequest $request
    ): RedirectResponse {
        ServiceType::create($request->validated());

        return to_route('admin.service-types.index')
            ->with('success', 'Jenis layanan berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ServiceType $serviceType): Response
    {
        return Inertia::render('MasterData/ServiceTypes/Show', [
            'serviceType' => $serviceType,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ServiceType $serviceType): Response
    {
        return Inertia::render('MasterData/ServiceTypes/Edit', [
            'serviceType' => $serviceType,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateServiceTypeRequest $request,
        ServiceType $serviceType
    ): RedirectResponse {
        $serviceType->update($request->validated());

        return to_route('admin.service-types.index')
            ->with('success', 'Service type berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ServiceType $serviceType): RedirectResponse
    {
        $serviceType->delete();

        return to_route('admin.service-types.index')
            ->with('success', 'Service type berhasil dihapus.');
    }
}