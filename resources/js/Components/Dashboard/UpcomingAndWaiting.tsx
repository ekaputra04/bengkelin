import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { bookingStatusConfig } from "@/consts/consts";
import { formatDate, formatDateTime, formatTime } from "@/lib/utils";

import { EmptyState } from "./shared";
import { BookingItem, WaitingRequestItem } from "./types";

interface Props {
    upcomingBookings: BookingItem[];
    waitingRequests: WaitingRequestItem[];
}

export function UpcomingAndWaiting({
    upcomingBookings,
    waitingRequests,
}: Props) {
    return (
        <section className="grid gap-6 xl:grid-cols-2">
            <Card className="border-0 shadow-sm ring-1 ring-black/5">
                <CardHeader>
                    <CardTitle>Booking Mendatang</CardTitle>
                    <CardDescription>
                        Order terdekat dengan status aktif.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {upcomingBookings.length === 0 ? (
                        <EmptyState text="Tidak ada booking mendatang." />
                    ) : (
                        upcomingBookings.map((booking) => (
                            <div key={booking.id} className="flex items-start justify-between gap-4 rounded-2xl border bg-white/75 p-4">
                                <div>
                                    <p className="font-medium">{booking.user.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {booking.service_type.name} · {booking.vehicle.license_plate}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formatDateTime(booking.start_at)}
                                    </p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig]?.className ?? "border-slate-200 bg-slate-50 text-slate-700"}`}>
                                        {bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig]?.label ?? booking.status}
                                    </span>
                                    <p className="text-xs text-muted-foreground">
                                        {booking.mechanic?.name ?? "-"}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm ring-1 ring-black/5">
                <CardHeader>
                    <CardTitle>Request Waiting Prioritas</CardTitle>
                    <CardDescription>
                        Pengajuan yang belum mendapat slot aman.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {waitingRequests.length === 0 ? (
                        <EmptyState text="Tidak ada request waiting." />
                    ) : (
                        waitingRequests.map((request) => (
                            <div key={request.id} className="rounded-2xl border bg-white/75 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-medium">{request.user.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {request.vehicle.brand} {request.vehicle.model} · {request.vehicle.license_plate}
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {request.service_type.name} · {request.service_type.duration_minutes} menit
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-amber-50 px-3 py-2 text-right text-xs text-amber-700">
                                        <div className="font-medium">
                                            {formatTime(request.requested_start_at)}
                                        </div>
                                        <div>{formatDate(request.requested_start_at)}</div>
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
