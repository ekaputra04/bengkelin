<?php

namespace App\Models;

use App\Enums\BookingRequestStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class BookingRequest extends Model
{
    /** @use HasFactory<\Database\Factories\BookingRequestFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'service_type_id',
        'mechanic_user_id',
        'requested_start_at',
        'requested_end_at',
        'status',
        'failure_reason',
    ];

    protected function casts(): array
    {
        return [
            'requested_start_at' => 'datetime',
            'requested_end_at' => 'datetime',
            'status' => BookingRequestStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }

    public function mechanic(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mechanic_user_id');
    }

    public function booking(): HasOne
    {
        return $this->hasOne(Booking::class);
    }
}
