import { CalendarDays, Car, Clock3, UserRound } from 'lucide-react';

import { BookingHeader } from '@/Components/Bookings/BookingHeader';
import { BookingPaymentInfo } from '@/Components/Bookings/BookingPaymentInfo';
import { BookingSchedule } from '@/Components/Bookings/BookingSchedule';
import { ServiceInfo } from '@/Components/Bookings/ServiceInfo';
import { MechanicInfo } from '@/Components/Mechanics/MechanicInfo';
import { VehicleInfo } from '@/Components/Vehicles/VehicleInfo';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { TBooking } from '@/types/types';
import { Head } from '@inertiajs/react';

interface Props {
    booking: TBooking;
}

export default function BookingDetail({ booking }: Props) {
    return (
        <DashboardLayout
            breadcrumbs={[
                { label: "Riwayat Servis" },
                { label: "Detail Pengerjaan" },
            ]}
        >
            <Head title="Detail Pengerjaan" />
            <div className="space-y-6">
                <div>
                    <h1 className="font-semibold text-2xl tracking-tight">
                        Detail Pengerjaan
                    </h1>

                    <p className="text-muted-foreground text-sm">
                        Informasi detail pengerjaan
                    </p>
                </div>

                <BookingHeader booking={booking} />

                <div className="gap-4 grid md:grid-cols-2">
                    <ServiceInfo booking={booking} />

                    <VehicleInfo booking={booking} />

                    <MechanicInfo booking={booking} />

                    <BookingSchedule booking={booking} />
                </div>

                <BookingPaymentInfo booking={booking} />

                {booking.notes && (
                    <div className="space-y-2">
                        <h3 className="font-medium text-sm">Catatan</h3>

                        <div className="bg-muted/40 p-4 border rounded-lg text-muted-foreground text-sm">
                            {booking.notes}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
