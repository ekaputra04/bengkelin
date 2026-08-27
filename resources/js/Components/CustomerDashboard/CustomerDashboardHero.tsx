import { ArrowRight, CalendarClock, CarFront, ReceiptText } from "lucide-react";

import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { TCustomerBooking } from "@/types/types";
import { Link } from "@inertiajs/react";

interface Props {
    userName: string;
    date: string;
    totalVehicles: number;
    remainingRevenueOpen: number;
    nextBooking: TCustomerBooking | null;
}

export function CustomerDashboardHero({
    userName,
    date,
    totalVehicles,
    remainingRevenueOpen,
    nextBooking,
}: Props) {
    const firstName = userName.split(" ")[0] ?? userName;

    return (
        <section className="relative overflow-hidden rounded-3xl border border-border bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.14),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.94),_rgba(248,250,252,0.98))] p-6 shadow-sm">
            <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[linear-gradient(135deg,rgba(15,23,42,0.05),transparent)] lg:block" />

            <div className="relative grid gap-6 lg:grid-cols-[1.55fr_1fr]">
                <div className="space-y-4">
                    <Badge className="bg-slate-900 text-slate-50 hover:bg-slate-900">
                        Dashboard Customer
                    </Badge>

                    <div className="space-y-2">
                        <h1 className="max-w-2xl font-semibold text-3xl tracking-tight">
                            Halo, {firstName}. Pantau jadwal servis, status request,
                            dan tagihan kendaraan dari satu tempat.
                        </h1>

                        <p className="max-w-2xl text-muted-foreground">
                            Snapshot akun per {formatDate(date)}. Fokus utama:
                            servis berikutnya, request yang masih menunggu slot,
                            dan sisa pembayaran aktif.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link href={route("customer.service-requests.create")}>
                            <Button>
                                Ajukan Booking
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>

                        <Link href={route("customer.work-orders.index")}>
                            <Button variant="outline">Lihat Work Order</Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-sky-600 p-3 text-white">
                                <CarFront className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Kendaraan Saya
                                </p>
                                <p className="font-semibold text-2xl">
                                    {totalVehicles}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-emerald-600 p-3 text-white">
                                <ReceiptText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Sisa Tagihan
                                </p>
                                <p className="font-semibold text-2xl">
                                    {formatCurrency(remainingRevenueOpen)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 sm:col-span-2 lg:col-span-1 backdrop-blur">
                        <p className="text-sm text-muted-foreground">
                            Servis Berikutnya
                        </p>
                        <div className="mt-2 flex items-start gap-3">
                            <div className="rounded-2xl bg-slate-950 p-3 text-white">
                                <CalendarClock className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                {nextBooking ? (
                                    <>
                                        <p className="font-semibold">
                                            {nextBooking.service_type.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {nextBooking.vehicle.license_plate}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {formatDate(nextBooking.start_at)} ·{" "}
                                            {formatTime(nextBooking.start_at)} -{" "}
                                            {formatTime(nextBooking.end_at)}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada booking aktif berikutnya.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
