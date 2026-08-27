import { UserRound } from 'lucide-react';

import { TBooking } from '@/types/types';

import DetailItem from '../ItemDetail';

interface Props {
    booking: TBooking;
}

export function MechanicInfo({ booking }: Props) {
    const mechanic = booking.mechanic;

    return (
        <div className="space-y-4 bg-card p-5 border rounded-xl">
            <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-primary/10 rounded-lg w-9 h-9">
                    <UserRound className="w-4 h-4 text-primary" />
                </div>

                <div>
                    <h3 className="font-medium text-sm">Mekanik</h3>

                    <p className="text-muted-foreground text-xs">
                        Mekanik yang menangani
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <DetailItem label="Nama" value={mechanic?.name ?? "-"} />

                <DetailItem label="Email" value={mechanic?.email ?? "-"} />
            </div>
        </div>
    );
}
