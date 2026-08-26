"use client";

import { formatCurrency, parseLocalDateTime } from '@/lib/utils';
import { TBookingRequest } from '@/types/types';
import { router } from '@inertiajs/react';
import { createColumnHelper } from '@tanstack/react-table';

import { DataTableFeatures } from '../DataTable/DataTableFeatures';
import { Button } from '../ui/button';
import BookingRequestStatusBadge from './ServiceRequestStatusBadge';

const columnHelper = createColumnHelper<DataTableFeatures, TBookingRequest>();

export const BookingRequestColumns = columnHelper.columns([
    columnHelper.accessor((row) => row.vehicle, {
        id: "vehicle",
        header: "Kendaraan",
        cell: ({ row }) => (
            <div className="">
                <span>
                    {row.original.vehicle.brand}{" "}
                    {row.original.vehicle.model}{" "}
                </span>
                <p className="text-muted-foreground text-sm">
                    {row.original.vehicle.license_plate}
                </p>
            </div>
        ),
    }),

    columnHelper.accessor((row) => row.user?.name, {
        id: "user_name",
        header: "Nama Pelanggan",
        cell: ({ row }) => {
            return (
                <div className="">
                    <p>{row.original.user?.name}</p>
                    <p className="text-muted-foreground text-xs">
                        {row.original.user?.email}
                    </p>
                </div>
            );
        },
    }),

    columnHelper.accessor((row) => row.service_type.name, {
        id: "service_type",
        header: "Layanan",
        cell: ({ row }) => {
            return (
                <div className="">
                    <p>{row.original.service_type.name}</p>
                    <p className="text-muted-foreground text-xs">
                        {formatCurrency(row.original.service_type.price)} -{" "}
                        {row.original.service_type.duration_minutes} Menit
                    </p>
                </div>
            );
        },
    }),

    columnHelper.accessor("requested_start_at", {
        header: "Waktu Diajukan",
        cell: (info) =>
            parseLocalDateTime(info.getValue()).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
            }),
    }),

    columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => {
            return <BookingRequestStatusBadge status={row.original.status} />;
        },
    }),

    columnHelper.accessor((row) => row.booking?.booking_code, {
        id: "booking",
        header: "Pesanan",
        cell: ({ row }) => {
            const booking = row.original.booking;

            if (!booking) {
                return (
                    <span className="text-muted-foreground text-sm">
                        Belum ada
                    </span>
                );
            }

            return (
                <div className="space-y-1">
                    <p className="font-mono font-medium text-sm">
                        {booking.booking_code}
                    </p>

                    <p className="text-muted-foreground text-xs">
                        DP Rp{" "}
                        {Number(booking.dp_amount).toLocaleString("id-ID")}
                    </p>
                </div>
            );
        },
    }),

    columnHelper.display({
        id: "aksi",
        header: "Aksi",
        cell: ({ row }) => {
            const booking = row.original.booking;

            if (booking?.status !== "pending_payment") {
                return null;
            }

            return (
                <Button
                    size="sm"
                    onClick={() =>
                        router.post(route("bookings.pay", booking.id))
                    }
                >
                    Bayar DP
                </Button>
            );
        },
    }),
]);
