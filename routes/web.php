<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\BookingRequestController;
use App\Http\Controllers\MechanicController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServiceTypeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::prefix('dashboard')
    ->middleware(['auth', 'verified'])
    ->group(function () {
        Route::get('/', function () {
            return Inertia::render('Dashboard');
        })->name('dashboard');

        Route::resource('service-types', ServiceTypeController::class);

        Route::resource('mechanics', MechanicController::class);

        Route::resource('service-requests', BookingRequestController::class)
            ->only(['index', 'create', 'store']);

        Route::get(
            'work-orders',
            [BookingController::class, 'index']
        )->name('work-orders.index');

        Route::patch(
            'work-orders/{booking}',
            [BookingController::class, 'update']
        )->name('work-orders.update');
    });

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
