import { Banknote } from 'lucide-react';

import { formatCurrency } from '@/lib/utils';
import { TBooking } from '@/types/types';

interface Props {
    booking: TBooking;
}

export function BookingPaymentInfo({ booking }: Props) {
    return (
        <div className="space-y-4 bg-card p-5 border rounded-xl">
            <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-primary/10 rounded-lg w-9 h-9">
                    <Banknote className="w-4 h-4 text-primary" />
                </div>

                <div>
                    <h3 className="font-medium text-sm">Pembayaran</h3>

                    <p className="text-muted-foreground text-xs">
                        Rincian biaya layanan
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Total layanan</span>

                    <span className="font-medium">
                        {formatCurrency(booking.service_price)}
                    </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">DP</span>

                    <span className="font-medium">
                        {formatCurrency(booking.dp_amount)}
                    </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t text-sm">
                    <span className="font-medium">Sisa pembayaran</span>

                    <span className="font-semibold">
                        {formatCurrency(booking.remaining_amount)}
                    </span>
                </div>
            </div>
        </div>
    );
}
