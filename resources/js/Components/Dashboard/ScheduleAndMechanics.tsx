import { Badge } from "@/Components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { bookingStatusConfig } from "@/consts/consts";
import { formatTime } from "@/lib/utils";

import { EmptyState } from "./shared";
import { BookingItem, MechanicLoadItem } from "./types";

interface Props {
    todayBookings: BookingItem[];
    mechanicLoad: MechanicLoadItem[];
}

export function ScheduleAndMechanics({ todayBookings, mechanicLoad }: Props) {
    return (
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-0 shadow-sm ring-1 ring-black/5">
                <CardHeader>
                    <CardTitle>Jadwal Hari Ini</CardTitle>
                    <CardDescription>
                        Order terdekat yang perlu dipantau admin.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {todayBookings.length === 0 ? (
                        <EmptyState text="Belum ada jadwal servis untuk hari ini." />
                    ) : (
                        todayBookings.map((booking) => (
                            <div key={booking.id} className="rounded-2xl border bg-white/75 p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="font-medium">{booking.user.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {booking.vehicle.brand} {booking.vehicle.model} · {booking.vehicle.license_plate}
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {booking.service_type.name} · {booking.mechanic?.name ?? "-"}
                                        </p>
                                    </div>
                                    <div className="space-y-2 text-sm sm:text-right">
                                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig]?.className ?? "border-slate-200 bg-slate-50 text-slate-700"}`}>
                                            {bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig]?.label ?? booking.status}
                                        </span>
                                        <p className="font-mono text-xs text-muted-foreground">
                                            {booking.booking_code}
                                        </p>
                                        <p className="font-medium">
                                            {formatTime(booking.start_at)} - {formatTime(booking.end_at)}
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
                    <CardTitle>Beban Mekanik</CardTitle>
                    <CardDescription>
                        Siapa yang paling padat hari ini.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {mechanicLoad.map((mechanic) => (
                        <div key={mechanic.id} className="rounded-2xl border bg-white/75 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-medium">{mechanic.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {mechanic.today_jobs_count} pekerjaan hari ini · {mechanic.in_progress_jobs_count} aktif
                                    </p>
                                </div>
                                <Badge variant="outline">
                                    {mechanic.waiting_assignments_count} processing
                                </Badge>
                            </div>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-[linear-gradient(90deg,#0f172a,#2563eb)]"
                                    style={{
                                        width: `${Math.min(100, mechanic.today_jobs_count * 20)}%`,
                                    }}
                                />
                            </div>
                            <p className="mt-3 text-xs text-muted-foreground">
                                {mechanic.next_booking
                                    ? `${formatTime(mechanic.next_booking.start_at)} · ${mechanic.next_booking.service_name ?? "Service"} · ${mechanic.next_booking.vehicle ?? "-"}`
                                    : "Belum ada booking terjadwal hari ini."}
                            </p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </section>
    );
}
