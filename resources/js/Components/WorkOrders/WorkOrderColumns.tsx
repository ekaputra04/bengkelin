"use client";
import { formatDateTime } from '@/lib/utils';
import { TWorkOrder } from '@/types/types';
import { createColumnHelper } from '@tanstack/react-table';

import BookingStatusBadge from '../Bookings/BookingStatusBadge';
import { DataTableFeatures } from '../DataTable/DataTableFeatures';
import { PaymentBadge } from '../PaymentBadge';
import { WorkOrderActions } from './WorkOrderActions';

const columnHelper = createColumnHelper<DataTableFeatures, TWorkOrder>();

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
                    {row.original.vehicle.brand} {row.original.vehicle.model} —{" "}
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
        cell: (info) => formatDateTime(new Date(info.getValue())),
    }),

    columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <BookingStatusBadge status={info.getValue()} />,
    }),

    columnHelper.display({
        id: "payment",
        header: "Pembayaran",
        cell: ({ row }) => <PaymentBadge booking={row.original} />,
    }),

    columnHelper.display({
        header: "Aksi",
        cell: ({ row }) => <WorkOrderActions booking={row.original} />,
    }),
]);
