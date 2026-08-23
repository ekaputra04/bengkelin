"use client";

import { Eye, MoreHorizontal, Pencil } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { TServiceType } from "@/types/types";
import { Link } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";

import { DataTableFeatures } from "../DataTable/DataTableFeatures";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ServiceTypeStatusBadge } from "./ServiceTypeStatusBadge";

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, TServiceType>();

export const ServiceTypeColumns = columnHelper.columns([
    columnHelper.accessor("name", {
        header: "Nama Layanan",
    }),
    columnHelper.accessor("description", {
        header: "Deskripsi Layanan",
    }),
    columnHelper.accessor("duration_minutes", {
        header: "Durasi (menit)",
    }),
    columnHelper.display({
        header: "Biaya Layanan",
        cell: (info) => {
            const price = info.row.original.price;
            return formatCurrency(price);
        },
    }),
    columnHelper.display({
        header: "DP Layanan",
        cell: (info) => {
            const dp = info.row.original.dp_amount;
            return formatCurrency(dp);
        },
    }),
    columnHelper.display({
        header: "Status",
        cell: ({ row }) => (
            <ServiceTypeStatusBadge isActive={row.original.is_active} />
        ),
    }),
    columnHelper.display({
        header: "Aksi",
        cell: ({ row }) => {
            const serviceType = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" className="p-0 w-8 h-8">
                            <MoreHorizontal />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <Link
                            href={route("service-types.show", serviceType.id)}
                        >
                            <DropdownMenuItem>
                                <Eye /> Lihat Detail
                            </DropdownMenuItem>
                        </Link>

                        <Link
                            href={route("service-types.edit", serviceType.id)}
                        >
                            <DropdownMenuItem>
                                <Pencil /> Edit
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
]);
