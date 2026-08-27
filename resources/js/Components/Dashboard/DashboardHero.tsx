import { ArrowRight, CarFront, Gauge } from "lucide-react";

import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Link } from "@inertiajs/react";

interface Props {
    date: string;
    totalBookings: number;
    totalVehicles: number;
    remainingRevenueOpen: number;
}

export function DashboardHero({
    date,
    totalBookings,
    totalVehicles,
    remainingRevenueOpen,
}: Props) {
    return (
        <section className="relative overflow-hidden rounded-3xl border border-border bg-[radial-gradient(circle_at_top_left,_rgba(35,99,235,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),_transparent_30%),linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(248,250,252,0.98))] p-6 shadow-sm">
            <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[linear-gradient(135deg,rgba(15,23,42,0.05),transparent)] lg:block" />
            <div className="relative grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                <div className="space-y-4">
                    <Badge className="bg-slate-900 text-slate-50 hover:bg-slate-900">
                        Ringkasan Operasional Bengkel
                    </Badge>
                    <div className="space-y-2">
                        <h1 className="max-w-2xl font-semibold text-3xl tracking-tight">
                            Kendalikan antrean servis, pembayaran DP, dan beban mekanik dari satu dashboard.
                        </h1>
                        <p className="max-w-2xl text-muted-foreground">
                            Snapshot hari ini {formatDate(date)}. Fokus utama:
                            order aktif, antrean request yang belum aman, dan
                            jadwal yang perlu segera dikonfirmasi.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link href={route("admin.work-orders.index")}>
                            <Button>
                                Lihat Work Order
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Link href={route("admin.service-requests.index")}>
                            <Button variant="outline">
                                Kelola Booking Request
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-slate-950 p-3 text-white">
                                <Gauge className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Order
                                </p>
                                <p className="font-semibold text-2xl">
                                    {totalBookings}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-emerald-600 p-3 text-white">
                                <CarFront className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Kendaraan Terdaftar
                                </p>
                                <p className="font-semibold text-2xl">
                                    {totalVehicles}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 sm:col-span-2 lg:col-span-1 backdrop-blur">
                        <p className="text-sm text-muted-foreground">
                            Potensi Sisa Pembayaran
                        </p>
                        <p className="mt-2 font-semibold text-2xl">
                            {formatCurrency(remainingRevenueOpen)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Total sisa tagihan pada order yang masih berjalan
                            atau baru selesai.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
