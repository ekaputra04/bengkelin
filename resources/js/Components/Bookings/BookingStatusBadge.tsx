import { Badge } from '@/Components/ui/badge';
import { bookingStatusConfig } from '@/consts/consts';
import { TBookingStatus } from '@/types/types';

interface Props {
    status: TBookingStatus;
}

export default function BookingStatusBadge({ status }: Props) {
    const config = bookingStatusConfig[status];

    if (!config) {
        return <Badge variant="outline">{status}</Badge>;
    }

    return <Badge className={config.className}>{config.label}</Badge>;
}
