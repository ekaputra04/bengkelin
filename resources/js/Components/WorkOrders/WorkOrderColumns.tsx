"use client";

import {
    Banknote,
    ChevronDown,
    Play,
    SquareCheck,
    UserX,
} from "lucide-react";

import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { formatDateTime } from "@/lib/utils";
import { TWorkOrder } from "@/types/types";
import { router } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";

import { DataTableFeatures } from "../DataTable/DataTableFeatures";

const columnHelper = createColumnHelper<DataTableFeatures, TWorkOrder>();

const statusLabels: Record<string, string> = {
    pending_payment: "Menunggu DP",
    confirmed: "Terjadwal",
    in_progress: "Dikerjakan",
    completed: "Selesai",
    cancelled: "Dibatalkan",
    expired: "Kedaluwarsa",
    no_show: "Tidak Datang",
};

export { statusLabels };

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
                ["cancelled", "expired", "no_show"].includes(status)
                    ? "destructive"
                    : "secondary"
            }
        >
            {statusLabels[status] ?? status}
        </Badge>
    );
}

function PaymentBadge({ booking }: { booking: TWorkOrder }) {
    if (booking.paid_at) {
        return <Badge variant="outline" className="text-green-600">Lunas</Badge>;
    }

    const dpPaid = booking.payment?.status === "paid";

    return (
        <Badge variant="secondary">
            {dpPaid ? "DP Lunas, Sisa Belum" : "Belum Bayar DP"}
        </Badge>
    );
}

function ActionsCell({ booking }: { booking: TWorkOrder }) {
    const actions: { label: string; icon: React.ReactNode; onClick: () => void; destructive?: boolean }[] = [];

    if (booking.status === "confirmed") {
        actions.push({
            label: "Mulai Pengerjaan",
            icon: <Play className="w-4 h-4" />,
            onClick: () => router.patch(route("work-orders.update", booking.id), { status: "in_progress" }),
        });
        actions.push({
            label: "Tidak Datang",
            icon: <UserX className="w-4 h-4" />,
            onClick: () => router.patch(route("work-orders.update", booking.id), { status: "no_show" }),
            destructive: true,
        });
    } else if (booking.status === "in_progress") {
        actions.push({
            label: "Selesaikan",
            icon: <SquareCheck className="w-4 h-4" />,
            onClick: () => router.patch(route("work-orders.update", booking.id), { status: "completed" }),
        });
        actions.push({
            label: "Tidak Datang",
            icon: <UserX className="w-4 h-4" />,
            onClick: () => router.patch(route("work-orders.update", booking.id), { status: "no_show" }),
            destructive: true,
        });
    }

    if (booking.status === "completed" && !booking.paid_at) {
        actions.push({
            label: "Bayar Sisa (Cash)",
            icon: <Banknote className="w-4 h-4" />,
            onClick: () => router.patch(route("work-orders.paid", booking.id)),
        });
    }

    if (actions.length === 0) {
        return <span className="text-muted-foreground text-sm">-</span>;
    }

    if (actions.length === 1) {
        return (
            <Button
                size="sm"
                variant={actions[0].destructive ? "destructive" : "outline"}
                onClick={actions[0].onClick}
            >
                {actions[0].icon}
                {actions[0].label}
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button size="sm" variant="outline">
                    Aksi <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {actions.map((action, i) => (
                    <DropdownMenuItem
                        key={i}
                        className={
                            action.destructive
                                ? "text-destructive focus:text-destructive"
                                : ""
                        }
                        onClick={action.onClick}
                    >
                        {action.icon}
                        {action.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const WorkOrderColumns = columnHelper.columns([
    columnHelper.accessor("booking_code", {
        header: "Kode Order",
        cell: (info) => (
            <span className="font-mono text-sm">{info.getValue()}</span>
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
            formatDateTime(new Date(info.getValue())),
    }),

    columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
    }),

    columnHelper.display({
        id: "payment",
        header: "Pembayaran",
        cell: ({ row }) => <PaymentBadge booking={row.original} />,
    }),

    columnHelper.display({
        header: "Aksi",
        cell: ({ row }) => <ActionsCell booking={row.original} />,
    }),
]);
