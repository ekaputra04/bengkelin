import { CalendarDays } from 'lucide-react';

import { formatDate } from '@/lib/utils';
import { TBooking } from '@/types/types';

import BookingStatusBadge from './BookingStatusBadge';

interface Props {
    booking: TBooking;
}

export function BookingHeader({ booking }: Props) {
    return (
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-4">
            <div>
                <p className="text-muted-foreground text-xs">Kode Booking</p>

                <h2 className="mt-1 font-mono font-semibold text-xl">
                    {booking.booking_code}
                </h2>

                <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                    <CalendarDays className="w-4 h-4" />

                    <span>{formatDate(booking.start_at)}</span>
                </div>
            </div>

            <BookingStatusBadge status={booking.status} />
        </div>
    );
}
