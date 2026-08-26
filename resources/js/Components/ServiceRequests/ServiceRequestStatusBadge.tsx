import { TBookingRequestStatus } from '@/types/types';

import { Badge } from '../ui/badge';

interface Props {
    status: TBookingRequestStatus;
}

const statusLabel: Record<TBookingRequestStatus, string> = {
    waiting: "Menunggu",
    processing: "Menunggu Pembayaran",
    converted: "Diproses",
    expired: "Kadaluwarsa",
    cancelled: "Dibatalkan",
};

const statusLabelClassName: Record<TBookingRequestStatus, string> = {
    waiting: "text-yellow-600 bg-yellow-100",
    processing: "text-green-600 bg-green-100",
    converted: "text-orange-600 bg-orange-100",
    expired: "text-red-600 bg-red-100",
    cancelled: "text-pink-600 bg-pink-100",
};

export default function BookingRequestStatusBadge({ status }: Props) {
    return (
        <Badge variant={"outline"} className={statusLabelClassName[status]}>
            {statusLabel[status]}
        </Badge>
    );
}
