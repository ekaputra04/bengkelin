import { TWorkOrder } from '@/types/types';

import { Badge } from './ui/badge';

export function PaymentBadge({ booking }: { booking: TWorkOrder }) {
    if (booking.status == "fully_paid") {
        return (
            <Badge
                variant="outline"
                className="bg-green-50 border-green-200 text-green-600"
            >
                Lunas
            </Badge>
        );
    }

    const dpPaid = booking.payment?.status === "paid";

    return (
        <Badge variant="secondary">
            {dpPaid ? "DP Lunas, Sisa Belum" : "Belum Bayar DP"}
        </Badge>
    );
}
