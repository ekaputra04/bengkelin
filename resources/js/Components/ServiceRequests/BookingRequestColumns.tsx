"use client";

import { TBookingRequest } from "@/types/types";
import { createColumnHelper } from "@tanstack/react-table";
import { router } from "@inertiajs/react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DataTableFeatures } from "../DataTable/DataTableFeatures";

const columnHelper = createColumnHelper<
    DataTableFeatures,
    TBookingRequest
>();

const requestStatusLabels: Record<string, string> = {
    waiting: "Menunggu Slot",
    processing: "Diproses",
    converted: "Order Dibuat",
    expired: "Kedaluwarsa",
    cancelled: "Dibatalkan",
};

export const BookingRequestColumns = columnHelper.columns([
    columnHelper.accessor((row) => row.vehicle, {
        id: "vehicle",
        header: "Kendaraan",
        cell: ({ row }) => (
            <span>
                {row.original.vehicle.brand}{" "}
                {row.original.vehicle.model} —{" "}
                {row.original.vehicle.license_plate}
            </span>
        ),
    }),

    columnHelper.accessor((row) => row.service_type.name, {
        id: "service_type",
        header: "Layanan",
    }),

    columnHelper.accessor("requested_start_at", {
        header: "Waktu Diajukan",
        cell: (info) =>
            new Date(info.getValue()).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
            }),
    }),

    columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
            const status = info.getValue();

            if (
                status === "converted" &&
                info.row.original.booking
            ) {
                return (
                    <Badge variant="default">
                        {requestStatusLabels[status]}
                    </Badge>
                );
            }

            return (
                <Badge
                    variant={
                        status === "cancelled" ||
                        status === "expired"
                            ? "destructive"
                            : "secondary"
                    }
                >
                    {requestStatusLabels[status] ?? status}
                </Badge>
            );
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
                        {Number(booking.dp_amount).toLocaleString(
                            "id-ID",
                        )}
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
                        router.post(
                            route("bookings.pay", booking.id),
                        )
                    }
                >
                    Bayar DP
                </Button>
            );
        },
    }),
]);
