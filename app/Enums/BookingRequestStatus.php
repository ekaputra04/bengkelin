<?php

namespace App\Enums;

enum BookingRequestStatus: string
{
  case WAITING = 'waiting';
  case PROCESSING = 'processing';
  case CONVERTED = 'converted';
  case EXPIRED = 'expired';
  case CANCELLED = 'cancelled';
}
