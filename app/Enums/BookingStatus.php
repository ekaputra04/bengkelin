<?php

namespace App\Enums;

enum BookingStatus: string
{
  case PENDING_PAYMENT = 'pending_payment';
  case CONFIRMED = 'confirmed';
  case COMPLETED = 'completed';
  case CANCELLED = 'cancelled';
  case EXPIRED = 'expired';
  case NO_SHOW = 'no_show';
}
