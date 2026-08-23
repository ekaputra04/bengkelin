"use client";

import { MoreHorizontal, Play, SquareCheck } from "lucide-react";

import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { TWorkOrder } from "@/types/types";
import { createColumnHelper } from "@tanstack/react-table";
import { router } from "@inertiajs/react";

import { DataTableFeatures } from "../DataTable/DataTableFeatures";

const columnHelper = createColumnHelper<
    DataTableFeatures,
    TWorkOrder
>();

const statusLabels: Record<string, string> = {
    pending_payment: "Menunggu DP",
    confirmed: "Terjadwal",
    in_progress: "Dikerjakan",
    completed: "Selesai",
    cancelled: "Dibatalkan",
    expired: "Kedaluwarsa",
    no_show: "Tidak Datang",
};

function StatusBadge({ status }: { status: string }) {
    if (status === "completed") {
        return (
            <Badge variant="outline" className="text-green-600">
                {statusLabels[status]}
            </Badge>
        );
    }

    return (
        <Badge
            variant={
                ["cancelled", "expired", "no_show"].includes(
                    status,
                )
                    ? "destructive"
                    : "secondary"
            }
        >
            {statusLabels[status] ?? status}
        </Badge>
    );
}

export const WorkOrderColumns = columnHelper.columns([
    columnHelper.accessor("booking_code", {
        header: "Kode Order",
        cell: (info) => (
            <span className="font-mono text-sm">
                {info.getValue()}
            </span>
        ),
    }),

    columnHelper.accessor((row) => row.user.name, {
        id: "customer",
        header: "Pelanggan",
        cell: ({ row }) => (
            <div className="space-y-0.5">
                <p>{row.original.user.name}</p>
                <p className="text-muted-foreground text-xs">
                    {row.original.vehicle.brand}{" "}
                    {row.original.vehicle.model} —{" "}
                    {row.original.vehicle.license_plate}
                </p>
            </div>
        ),
    }),

    columnHelper.accessor((row) => row.service_type.name, {
        id: "service_type",
        header: "Layanan",
    }),

    columnHelper.accessor((row) => row.mechanic.name, {
        id: "mechanic",
        header: "Mekanik",
    }),

    columnHelper.accessor("start_at", {
        header: "Jadwal",
        cell: (info) =>
            new Date(info.getValue()).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
            }),
    }),

    columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
    }),

    columnHelper.display({
        header: "Aksi",
        cell: ({ row }) => {
            const booking = row.original;

            const nextAction =
                booking.status === "confirmed"
                    ? {
                          label: "Mulai Pengerjaan",
                          icon: <Play />,
                          status: "in_progress",
                      }
                    : booking.status === "in_progress"
                      ? {
                            label: "Selesaikan",
                            icon: <SquareCheck />,
                            status: "completed",
                        }
                      : null;

            if (!nextAction) {
                return (
                    <span className="text-muted-foreground text-sm">
                        -
                    </span>
                );
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button
                            variant="ghost"
                            className="p-0 w-8 h-8"
                        >
                            <MoreHorizontal />
                            <span className="sr-only">
                                Open menu
                            </span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                router.patch(
                                    route(
                                        "work-orders.update",
                                        booking.id,
                                    ),
                                    {
                                        status: nextAction.status,
                                    },
                                )
                            }
                        >
                            {nextAction.icon}{" "}
                            {nextAction.label}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
]);
