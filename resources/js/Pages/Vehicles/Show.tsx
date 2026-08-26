import { ArrowLeft } from 'lucide-react';

import BookingHistory from '@/Components/Bookings/BookingHistory';
import { Button } from '@/Components/ui/button';
import VehicleOwnerCard from '@/Components/Vehicles/VehicleOwnerCard';
import VehicleInfoCard from '@/Components/Vehicles/VehiclesInfoCard';
import { useAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { TVehicle } from '@/types/types';
import { Head, Link } from '@inertiajs/react';

interface Props {
    vehicle: TVehicle;
}

export default function Show({ vehicle }: Props) {
    const { role } = useAuth();
    const backUrl =
        role == "admin" ? "admin.vehicles.index" : "customer.vehicles.index";

    return (
        <DashboardLayout
            breadcrumbs={[
                {
                    label: "Kendaraan",
                    href: route(backUrl),
                },
                {
                    label: vehicle.license_plate,
                },
            ]}
        >
            <Head title={vehicle.license_plate} />

            <div className="space-y-6 mx-auto max-w-5xl">
                <div className="flex items-center gap-4">
                    <Link href={route(backUrl)}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft />
                        </Button>
                    </Link>

                    <div>
                        <h1 className="font-semibold text-2xl">
                            {vehicle.brand} {vehicle.model}
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            {vehicle.license_plate}
                        </p>
                    </div>
                </div>

                <VehicleInfoCard vehicle={vehicle} />

                <VehicleOwnerCard vehicle={vehicle} />

                <BookingHistory vehicle={vehicle} />
            </div>
        </DashboardLayout>
    );
}
