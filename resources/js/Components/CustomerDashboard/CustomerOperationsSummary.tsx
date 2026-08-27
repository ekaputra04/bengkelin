import { CarFront, Clock3, CreditCard, Wrench } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MiniStat, StatRow } from "@/Components/Dashboard/shared";
import { CustomerDashboardProps } from "./types";

interface Props {
    todaySummary: CustomerDashboardProps["todaySummary"];
    overview: CustomerDashboardProps["overview"];
}

export function CustomerOperationsSummary({ todaySummary, overview }: Props) {
    return (
        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            <Card className="border-0 shadow-sm ring-1 ring-black/5">
                <CardHeader>
                    <CardTitle>Pulse Hari Ini</CardTitle>
                    <CardDescription>
                        Ringkasan aktivitas akun pada {formatDate(todaySummary.date)}.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <MiniStat
                        label="Jadwal Hari Ini"
                        value={todaySummary.bookings_count}
                        accent="bg-slate-900"
                    />
                    <MiniStat
                        label="Siap Datang"
                        value={todaySummary.confirmed_count}
                        accent="bg-blue-500"
                    />
                    <MiniStat
                        label="Sedang Dikerjakan"
                        value={todaySummary.in_progress_count}
                        accent="bg-emerald-500"
                    />
                    <MiniStat
                        label="Selesai Hari Ini"
                        value={todaySummary.completed_count}
                        accent="bg-cyan-500"
                    />
                    <MiniStat
                        label="DP Belum Dibayar"
                        value={todaySummary.pending_payment_count}
                        accent="bg-amber-500"
                    />
                    <MiniStat
                        label="Request Waiting"
                        value={todaySummary.waiting_requests_count}
                        accent="bg-rose-500"
                    />
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm ring-1 ring-black/5">
                <CardHeader>
                    <CardTitle>Ringkasan Akun</CardTitle>
                    <CardDescription>
                        Gambaran kendaraan, riwayat booking, dan tagihan aktif.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <StatRow
                        icon={<Wrench className="w-4 h-4" />}
                        label="Total Booking"
                        value={overview.total_bookings}
                    />
                    <StatRow
                        icon={<CarFront className="w-4 h-4" />}
                        label="Kendaraan Terdaftar"
                        value={overview.total_vehicles}
                    />
                    <StatRow
                        icon={<Clock3 className="w-4 h-4" />}
                        label="Booking Selesai"
                        value={overview.completed_bookings}
                    />
                    <StatRow
                        icon={<CreditCard className="w-4 h-4" />}
                        label="Sisa Pembayaran"
                        value={formatCurrency(overview.remaining_revenue_open)}
                    />
                </CardContent>
            </Card>
        </section>
    );
}
