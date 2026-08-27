import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { bookingStatusConfig } from "@/consts/consts";
import { EmptyState, requestStatusClasses, requestStatusLabels } from "@/Components/Dashboard/shared";
import { formatDate, formatDateTime, formatTime } from "@/lib/utils";
import { TBookingRequest, TCustomerBooking } from "@/types/types";

interface Props {
    todayBookings: TCustomerBooking[];
    upcomingBookings: TCustomerBooking[];
    waitingRequests: TBookingRequest[];
}

export function CustomerScheduleAndRequests({
    todayBookings,
    upcomingBookings,
    waitingRequests,
}: Props) {
    return (
        <section className="grid gap-6 xl:grid-cols-2">
            <Card className="border-0 shadow-sm ring-1 ring-black/5">
                <CardHeader>
                    <CardTitle>Jadwal Saya</CardTitle>
                    <CardDescription>
                        Booking hari ini dan servis aktif terdekat yang perlu Anda pantau.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {todayBookings.length === 0 && upcomingBookings.length === 0 ? (
                        <EmptyState text="Belum ada jadwal servis aktif." />
                    ) : (
                        [...todayBookings, ...upcomingBookings]
                            .filter(
                                (booking, index, items) =>
                                    items.findIndex((item) => item.id === booking.id) === index,
                            )
                            .slice(0, 6)
                            .map((booking) => (
                                <div
                                    key={booking.id}
                                    className="rounded-2xl border bg-white/75 p-4"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <p className="font-medium">
                                                {booking.service_type.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {booking.vehicle.brand} {booking.vehicle.model} ·{" "}
                                                {booking.vehicle.license_plate}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Mekanik: {booking.mechanic?.name ?? "-"}
                                            </p>
                                        </div>
                                        <div className="space-y-2 text-sm sm:text-right">
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
                                            <p className="font-mono text-xs text-muted-foreground">
                                                {booking.booking_code}
                                            </p>
                                            <p className="font-medium">
                                                {formatTime(booking.start_at)} -{" "}
                                                {formatTime(booking.end_at)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(booking.start_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                    )}
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm ring-1 ring-black/5">
                <CardHeader>
                    <CardTitle>Request Perlu Perhatian</CardTitle>
                    <CardDescription>
                        Request yang masih waiting atau sedang menunggu pembayaran DP.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {waitingRequests.length === 0 ? (
                        <EmptyState text="Tidak ada request yang perlu ditindaklanjuti." />
                    ) : (
                        waitingRequests.map((request) => (
                            <div
                                key={request.id}
                                className="rounded-2xl border bg-white/75 p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-medium">
                                            {request.service_type.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {request.vehicle.brand} {request.vehicle.model} ·{" "}
                                            {request.vehicle.license_plate}
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Durasi {request.service_type.duration_minutes} menit
                                        </p>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs ring-1 ${
                                                requestStatusClasses[request.status] ??
                                                "bg-slate-50 text-slate-700 ring-slate-200"
                                            }`}
                                        >
                                            {requestStatusLabels[request.status] ??
                                                request.status}
                                        </span>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDateTime(request.requested_start_at)}
                                        </p>
                                    </div>
                                </div>

                                {request.failure_reason ? (
                                    <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
                                        {request.failure_reason}
                                    </p>
                                ) : null}
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
