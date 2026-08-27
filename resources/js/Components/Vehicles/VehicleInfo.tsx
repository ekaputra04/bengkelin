import { Car } from 'lucide-react';

import { TBooking } from '@/types/types';

import DetailItem from '../ItemDetail';

interface Props {
    booking: TBooking;
}

const vehicleTypeLabels: Record<string, string> = {
    motorcycle: "Sepeda Motor",
    car: "Mobil",
};

export function VehicleInfo({ booking }: Props) {
    const vehicle = booking.vehicle;

    return (
        <div className="space-y-4 bg-card p-5 border rounded-xl">
            <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-primary/10 rounded-lg w-9 h-9">
                    <Car className="w-4 h-4 text-primary" />
                </div>

                <div>
                    <h3 className="font-medium text-sm">Kendaraan</h3>

                    <p className="text-muted-foreground text-xs">
                        Kendaraan yang diservis
                    </p>
                </div>
            </div>

            <div className="gap-4 grid grid-cols-2">
                <DetailItem
                    label="No. Polisi"
                    value={
                        <span className="font-mono">
                            {vehicle?.license_plate ?? "-"}
                        </span>
                    }
                />

                <DetailItem
                    label="Jenis"
                    value={
                        vehicle?.vehicle_type
                            ? (vehicleTypeLabels[vehicle.vehicle_type] ??
                              vehicle.vehicle_type)
                            : "-"
                    }
                />

                <DetailItem label="Merek" value={vehicle?.brand ?? "-"} />

                <DetailItem label="Model" value={vehicle?.model ?? "-"} />

                <DetailItem label="Tahun" value={vehicle?.year ?? "-"} />
            </div>
        </div>
    );
}
