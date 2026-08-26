<?php

namespace App\Enums;

enum BookingStatus: string
{
  case PENDING_PAYMENT = 'pending_payment';
  case CONFIRMED = 'confirmed';
  case IN_PROGRESS = 'in_progress';
  case COMPLETED = 'completed';
  case FULLY_PAID = 'fully_paid';
  case CANCELLED = 'cancelled';
  case EXPIRED = 'expired';
  case NO_SHOW = 'no_show';
}