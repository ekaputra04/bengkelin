import { Calendar, Car, Key } from "lucide-react";

import { Button } from "@/Components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { TCustomerBooking, TVehicle } from "@/types/types";
import { Head, Link, usePage } from "@inertiajs/react";

interface Props {
    vehicles: TVehicle[];
    upcomingBooking?: TCustomerBooking | null;
    todayBooking?: TCustomerBooking | null;
    recentBookings: TCustomerBooking[];
}

const bookingStatuses: Record<string, string> = {
    pending_payment: "Menunggu DP",
    confirmed: "Terjadwal",
    in_progress: "Dikerjakan",
    completed: "Selesai",
    cancelled: "Dibatalkan",
    expired: "Kedaluwarsa",
    no_show: "Tidak Datang",
};

const fmtDate = (value: string) =>
    new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

const fmtTime = (value: string) =>
    new Date(value).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });

const vehicleIcon = (type: string) =>
    type === "car" ? (
        <span className="material-symbols-outlined">directions_car</span>
    ) : (
        <span className="material-symbols-outlined">two_wheeler</span>
    );

export default function UserDashboard({
    vehicles,
    upcomingBooking,
    todayBooking,
    recentBookings,
}: Props) {
    const { auth } = usePage<any>().props;

    const firstName = (auth.user.name ?? "").split(" ")[0];

    return (
        <DashboardLayout>
            <Head title="Bengkelin" />

            <div className="gap-6 grid grid-cols-1 lg:grid-cols-12 mx-auto w-full">
                <div className="flex flex-col gap-6 lg:col-span-8">
                    <section className="relative flex md:flex-row flex-col justify-between items-center gap-6 bg-card/95 shadow-sm backdrop-blur-sm p-6 border border-border rounded-xl overflow-hidden">
                        <div className="z-0 absolute inset-0 bg-gradient-to-r from-muted to-transparent opacity-50" />

                        <div className="z-10 relative">
                            <h2 className="mb-2 font-semibold text-foreground text-3xl">
                                Halo, {firstName}!
                            </h2>

                            <p className="text-muted-foreground text-sm">
                                Selamat datang di Bengkelin, tempatnya untuk
                                memperbaiki kendaraanmu
                            </p>
                        </div>

                        <Link href={route("service-requests.create")}>
                            <Button>
                                <Key />
                                Pesan Layanan
                            </Button>
                        </Link>
                    </section>

                    <section className="flex flex-col gap-4">
                        <h3 className="text-foreground text-headline-md">
                            Servis Terjadwal
                        </h3>

                        {upcomingBooking ? (
                            <div className="bg-card shadow-sm p-0 border border-border rounded-xl overflow-hidden">
                                <div className="flex justify-between items-center bg-muted px-4 py-2 border-border border-b">
                                    <span className="flex items-center gap-2 text-label-md text-primary">
                                        <span className="text-[16px] material-symbols-outlined">
                                            verified
                                        </span>

                                        {bookingStatuses[
                                            upcomingBooking.status
                                        ] ?? upcomingBooking.status}
                                    </span>

                                    <span className="text-label-sm text-muted-foreground">
                                        Booking ID: #
                                        {upcomingBooking.booking_code}
                                    </span>
                                </div>

                                <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex justify-center items-center bg-secondary rounded-full w-12 h-12 text-foreground shrink-0">
                                            {vehicleIcon(
                                                upcomingBooking.vehicle
                                                    .vehicle_type,
                                            )}
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-foreground text-label-md">
                                                {upcomingBooking.vehicle.brand}{" "}
                                                {upcomingBooking.vehicle.model}
                                            </h4>

                                            <p className="text-body-sm text-muted-foreground">
                                                {
                                                    upcomingBooking.vehicle
                                                        .license_plate
                                                }
                                            </p>

                                            <p className="inline-block bg-muted mt-1 px-2 py-1 rounded text-label-sm text-muted-foreground">
                                                {
                                                    upcomingBooking.service_type
                                                        .name
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Calendar />

                                            <div className="text-body-sm">
                                                <p className="font-medium text-foreground">
                                                    {fmtDate(
                                                        upcomingBooking.start_at,
                                                    )}
                                                </p>

                                                <p className="text-muted-foreground">
                                                    {fmtTime(
                                                        upcomingBooking.start_at,
                                                    )}{" "}
                                                    -{" "}
                                                    {fmtTime(
                                                        upcomingBooking.end_at,
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-[20px] text-muted-foreground material-symbols-outlined">
                                                engineering
                                            </span>

                                            <div className="text-body-sm">
                                                <p className="font-medium text-foreground">
                                                    {
                                                        upcomingBooking
                                                            ?.mechanic?.name
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-[20px] text-muted-foreground material-symbols-outlined">
                                                payments
                                            </span>

                                            <div className="flex items-center gap-2 text-body-sm">
                                                <span
                                                    className={`px-2 py-0.5 rounded text-xs ${
                                                        upcomingBooking.payment
                                                            ?.status === "paid"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-accent text-foreground"
                                                    }`}
                                                >
                                                    {upcomingBooking.payment
                                                        ?.status === "paid"
                                                        ? "DP Dibayar"
                                                        : "Menunggu DP"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 bg-card px-4 py-3 border-border border-t">
                                    <Link
                                        href={route("service-requests.index")}
                                        className="hover:bg-muted px-4 py-2 border border-primary rounded-lg text-label-md text-primary transition-colors"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-card shadow-sm py-8 border border-border rounded-xl text-center">
                                <span className="mb-2 text-[48px] text-muted-foreground material-symbols-outlined">
                                    event_available
                                </span>

                                <p className="text-body-md text-muted-foreground">
                                    Belum ada servis terjadwal.
                                </p>

                                <Link
                                    href={route("service-requests.create")}
                                    className="inline-block mt-2 text-label-md text-primary hover:underline"
                                >
                                    Ajukan servis sekarang
                                </Link>
                            </div>
                        )}
                    </section>

                    <section className="flex flex-col gap-4">
                        <div className="flex justify-between items-end">
                            <h3 className="text-foreground text-headline-md">
                                Riwayat Servis
                            </h3>

                            <Link
                                href={route("service-requests.index")}
                                className="text-label-md text-primary hover:underline"
                            >
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="bg-card shadow-sm border border-border rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table className="w-full text-left border-collapse">
                                    <TableHeader>
                                        <TableRow className="border-border border-b text-label-sm text-muted-foreground">
                                            <TableHead className="p-4 font-medium">
                                                Date
                                            </TableHead>
                                            <TableHead className="p-4 font-medium">
                                                Vehicle
                                            </TableHead>
                                            <TableHead className="p-4 font-medium">
                                                Service
                                            </TableHead>
                                            <TableHead className="p-4 font-medium">
                                                Status
                                            </TableHead>
                                            <TableHead className="p-4" />
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody className="text-body-sm text-foreground">
                                        {recentBookings.length === 0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={5}
                                                    className="p-4 text-muted-foreground text-center"
                                                >
                                                    Belum ada riwayat booking.
                                                </TableCell>
                                            </TableRow>
                                        )}

                                        {recentBookings.map((booking) => (
                                            <TableRow
                                                key={booking.id}
                                                className="hover:bg-card border-border border-b last:border-b-0 transition-colors"
                                            >
                                                <TableCell className="p-4">
                                                    {fmtDate(booking.start_at)}
                                                </TableCell>

                                                <TableCell className="p-4">
                                                    {booking.vehicle.brand}{" "}
                                                    {booking.vehicle.model}
                                                    <br />
                                                    <span className="text-muted-foreground text-xs">
                                                        {
                                                            booking.vehicle
                                                                .license_plate
                                                        }
                                                    </span>
                                                </TableCell>

                                                <TableCell className="p-4">
                                                    {booking.service_type.name}
                                                </TableCell>

                                                <TableCell className="p-4">
                                                    <span className="bg-accent px-2 py-1 rounded-full text-foreground text-xs">
                                                        {bookingStatuses[
                                                            booking.status
                                                        ] ?? booking.status}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="p-4 text-muted-foreground text-right">
                                                    <span className="material-symbols-outlined">
                                                        chevron_right
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </section>
                </div>

                <aside className="flex flex-col gap-6 lg:col-span-4">
                    <section className="bg-card shadow-sm p-4 border border-border rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="flex items-center gap-2 font-semibold text-foreground text-label-md">
                                <Car />
                                Kendaraan Saya
                            </h3>

                            <Link
                                href={route("service-requests.create")}
                                className="text-label-sm text-primary hover:underline"
                            >
                                Manage
                            </Link>
                        </div>

                        <p className="mb-4 text-body-sm text-muted-foreground">
                            You have {vehicles.length} vehicle
                            {vehicles.length === 1 ? "" : "s"} registered.
                        </p>

                        <div className="space-y-3">
                            {vehicles.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    className="group flex items-center gap-3 p-3 border border-border hover:border-primary rounded-lg transition-colors"
                                >
                                    <div className="flex justify-center items-center bg-muted group-hover:bg-primary rounded w-10 h-10 text-foreground group-hover:text-primary-foreground transition-colors">
                                        {vehicleIcon(vehicle.vehicle_type)}
                                    </div>

                                    <div className="flex-grow">
                                        <p className="text-foreground text-label-md">
                                            {vehicle.brand} {vehicle.model}
                                        </p>

                                        <p className="text-label-sm text-muted-foreground">
                                            {vehicle.license_plate}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {vehicles.length === 0 && (
                                <p className="text-body-sm text-muted-foreground text-center">
                                    Belum ada kendaraan terdaftar.
                                </p>
                            )}
                        </div>

                        <Link
                            href={route("service-requests.create")}
                            className="flex justify-center items-center gap-2 hover:bg-muted mt-4 py-2 border border-border border-dashed rounded-lg w-full text-label-md text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <span className="text-[18px] material-symbols-outlined">
                                add
                            </span>{" "}
                            Add Vehicle
                        </Link>
                    </section>

                    {/* Active Booking / Waiting List */}
                    <section className="bg-card bg-gradient-to-br from-card to-muted shadow-sm p-4 border border-border rounded-xl">
                        <h3 className="flex items-center gap-2 mb-4 font-semibold text-foreground text-label-md">
                            <span className="material-symbols-outlined">
                                hourglass_top
                            </span>{" "}
                            Today's Activity
                        </h3>

                        {todayBooking ? (
                            <div className="space-y-2 py-2 text-center">
                                <span className="text-[48px] text-primary material-symbols-outlined">
                                    build_circle
                                </span>

                                <p className="text-body-md text-foreground">
                                    Servis sedang berjalan hari ini.
                                </p>

                                <p className="text-body-sm text-muted-foreground">
                                    #{todayBooking.booking_code} —{" "}
                                    {fmtTime(todayBooking.start_at)}
                                </p>
                            </div>
                        ) : (
                            <div className="py-6 text-center">
                                <span className="mb-2 text-border text-[48px] material-symbols-outlined">
                                    check_circle
                                </span>

                                <p className="text-body-md text-muted-foreground">
                                    No active service today.
                                </p>

                                <p className="mt-1 text-body-sm text-muted-foreground">
                                    {upcomingBooking
                                        ? `Your next booking is on ${fmtDate(
                                              upcomingBooking.start_at,
                                          )}.`
                                        : "Belum ada jadwal servis berikutnya."}
                                </p>
                            </div>
                        )}
                    </section>
                </aside>
            </div>
        </DashboardLayout>
    );
}
