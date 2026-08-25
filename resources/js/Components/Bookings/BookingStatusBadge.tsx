import { Badge } from '@/Components/ui/badge';
import { TBookingStatus } from '@/types/types';

interface Props {
    status: TBookingStatus;
}

const statusConfig: Record<
    TBookingStatus,
    {
        label: string;
        className?: string;
    }
> = {
    pending_payment: {
        label: "Menunggu Pembayaran",
        className:
            "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300",
    },

    confirmed: {
        label: "Dikonfirmasi",
        className:
            "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
    },

    in_progress: {
        label: "Sedang Diproses",
        className:
            "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
    },

    completed: {
        label: "Selesai",
        className:
            "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-300",
    },

    cancelled: {
        label: "Dibatalkan",
        className:
            "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
    },

    expired: {
        label: "Kadaluwarsa",
        className:
            "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300",
    },

    no_show: {
        label: "Tidak Hadir",
        className:
            "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300",
    },
};

export default function BookingStatusBadge({ status }: Props) {
    const config = statusConfig[status];

    if (!config) {
        return <Badge variant="outline">{status}</Badge>;
    }

    return <Badge className={config.className}>{config.label}</Badge>;
}
