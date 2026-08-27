import { Wrench } from 'lucide-react';

import { TBooking } from '@/types/types';

import DetailItem from '../ItemDetail';

interface Props {
    booking: TBooking;
}

function formatCurrency(value: number | string) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value));
}

export function ServiceInfo({ booking }: Props) {
    const service = booking.service_type;

    return (
        <div className="space-y-4 bg-card p-5 border rounded-xl">
            <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-primary/10 rounded-lg w-9 h-9">
                    <Wrench className="w-4 h-4 text-primary" />
                </div>

                <div>
                    <h3 className="font-medium text-sm">Layanan</h3>

                    <p className="text-muted-foreground text-xs">
                        Detail servis
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <DetailItem label="Jenis Servis" value={service?.name ?? "-"} />

                <DetailItem
                    label="Durasi"
                    value={service ? `${service.duration_minutes} menit` : "-"}
                />

                <DetailItem
                    label="Harga"
                    value={service ? formatCurrency(service.price) : "-"}
                />

                {service?.description && (
                    <DetailItem
                        label="Deskripsi"
                        value={
                            <span className="font-normal text-muted-foreground">
                                {service.description}
                            </span>
                        }
                    />
                )}
            </div>
        </div>
    );
}
