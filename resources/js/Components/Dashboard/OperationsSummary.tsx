import { CarFront, Clock3, CreditCard, Users } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

import { MiniStat, StatRow } from "./shared";

interface Props {
    todaySummary: {
        date: string;
        bookings_count: number;
        confirmed_count: number;
        in_progress_count: number;
        completed_count: number;
        pending_payment_count: number;
        waiting_requests_count: number;
    };
    overview: {
        total_customers: number;
        total_vehicles: number;
        waiting_requests: number;
        remaining_revenue_open: number;
    };
}

export function OperationsSummary({ todaySummary, overview }: Props) {
    return (
        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            <Card className="border-0 shadow-sm ring-1 ring-black/5">
                <CardHeader>
                    <CardTitle>Pulse Hari Ini</CardTitle>
                    <CardDescription>
                        Ringkasan operasional pada {formatDate(todaySummary.date)}.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <MiniStat label="Jadwal Hari Ini" value={todaySummary.bookings_count} accent="bg-slate-900" />
                    <MiniStat label="Menunggu Konfirmasi" value={todaySummary.confirmed_count} accent="bg-blue-500" />
                    <MiniStat label="Sedang Dikerjakan" value={todaySummary.in_progress_count} accent="bg-emerald-500" />
                    <MiniStat label="Selesai Hari Ini" value={todaySummary.completed_count} accent="bg-cyan-500" />
                    <MiniStat label="DP Belum Dibayar" value={todaySummary.pending_payment_count} accent="bg-amber-500" />
                    <MiniStat label="Request Waiting" value={todaySummary.waiting_requests_count} accent="bg-rose-500" />
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm ring-1 ring-black/5">
                <CardHeader>
                    <CardTitle>Basis Sistem</CardTitle>
                    <CardDescription>
                        Gambaran kapasitas pelanggan dan aset.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <StatRow icon={<Users className="w-4 h-4" />} label="Pelanggan Terdaftar" value={overview.total_customers} />
                    <StatRow icon={<CarFront className="w-4 h-4" />} label="Kendaraan" value={overview.total_vehicles} />
                    <StatRow icon={<Clock3 className="w-4 h-4" />} label="Request Waiting" value={overview.waiting_requests} />
                    <StatRow icon={<CreditCard className="w-4 h-4" />} label="Sisa Pembayaran Terbuka" value={formatCurrency(overview.remaining_revenue_open)} />
                </CardContent>
            </Card>
        </section>
    );
}
