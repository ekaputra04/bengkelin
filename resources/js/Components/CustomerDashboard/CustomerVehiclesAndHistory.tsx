import { ArrowRight } from "lucide-react";

import { EmptyState } from "@/Components/Dashboard/shared";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { bookingStatusConfig, vehicleTypeLabels } from "@/consts/consts";
import { formatDateTime } from "@/lib/utils";
import { TCustomerBooking, TVehicle } from "@/types/types";
import { Link } from "@inertiajs/react";

interface Props {
    recentBookings: TCustomerBooking[];
    vehicles: Array<TVehicle & { bookings_count: number }>;
}

export function CustomerVehiclesAndHistory({
    recentBookings,
    vehicles,
}: Props) {
    return (
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-0 shadow-sm ring-1 ring-black/5">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                        <CardTitle>Riwayat Booking</CardTitle>
                        <CardDescription>
                            Booking terbaru Anda, termasuk status pengerjaan dan pembayaran.
                        </CardDescription>
                    </div>
                    <Link href={route("customer.work-orders.index")}>
                        <Button variant="outline" size="sm">
                            Semua Work Order
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                    {recentBookings.length === 0 ? (
                        <EmptyState text="Belum ada riwayat booking." />
                    ) : (
                        recentBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="flex items-start justify-between gap-4 rounded-2xl border bg-white/75 p-4"
                            >
                                <div>
                                    <p className="font-medium">
                                        {booking.service_type.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {booking.vehicle.brand} {booking.vehicle.model} ·{" "}
                                        {booking.vehicle.license_plate}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formatDateTime(booking.start_at)}
                                    </p>
                                </div>

                                <div className="space-y-2 text-right">
                                    <span
                                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${
                                            bookingStatusConfig[
                                                booking.status as keyof typeof bookingStatusConfig
                                            ]?.className ??
                                            "border-slate-200 bg-slate-50 text-slate-700"
                                        }`}
                                    >
                                        {bookingStatusConfig[
                                            booking.status as keyof typeof bookingStatusConfig
                                        ]?.label ?? booking.status}
                                    </span>
                                    <p className="text-xs text-muted-foreground">
                                        {booking.booking_code}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm ring-1 ring-black/5">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                        <CardTitle>Kendaraan Saya</CardTitle>
                        <CardDescription>
                            Daftar kendaraan yang bisa dipakai untuk booking servis.
                        </CardDescription>
                    </div>
                    <Link href={route("customer.vehicles.index")}>
                        <Button variant="outline" size="sm">
                            Kelola Kendaraan
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                    {vehicles.length === 0 ? (
                        <EmptyState text="Belum ada kendaraan terdaftar." />
                    ) : (
                        vehicles.map((vehicle) => (
                            <div
                                key={vehicle.id}
                                className="rounded-2xl border bg-white/75 p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-medium">
                                            {vehicle.brand} {vehicle.model}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {vehicle.license_plate}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {vehicle.year ?? "-"} ·{" "}
                                            {vehicle.vehicle_type
                                                ? vehicleTypeLabels[vehicle.vehicle_type]
                                                : "-"}
                                        </p>
                                    </div>

                                    <Badge variant="outline">
                                        {vehicle.bookings_count} booking
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
