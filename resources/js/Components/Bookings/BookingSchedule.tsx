import { Clock3 } from 'lucide-react';

import { TBooking } from '@/types/types';

import DetailItem from '../ItemDetail';

interface Props {
    booking: TBooking;
}

function formatTime(value: string) {
    return new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

export function BookingSchedule({ booking }: Props) {
    return (
        <div className="space-y-4 bg-card p-5 border rounded-xl">
            <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-primary/10 rounded-lg w-9 h-9">
                    <Clock3 className="w-4 h-4 text-primary" />
                </div>

                <div>
                    <h3 className="font-medium text-sm">Jadwal</h3>

                    <p className="text-muted-foreground text-xs">
                        Waktu pengerjaan
                    </p>
                </div>
            </div>

            <div className="gap-4 grid grid-cols-2">
                <DetailItem
                    label="Mulai"
                    value={formatTime(booking.start_at)}
                />

                <DetailItem
                    label="Selesai"
                    value={formatTime(booking.end_at)}
                />
            </div>
        </div>
    );
}
