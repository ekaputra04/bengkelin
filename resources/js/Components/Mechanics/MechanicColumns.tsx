"use client";

import { Eye, MoreHorizontal, Pencil } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { TMechanic, TServiceType } from "@/types/types";
import { Link } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";

import { DataTableFeatures } from "../DataTable/DataTableFeatures";
import { ServiceTypeStatusBadge } from "../ServiceTypes/ServiceTypeStatusBadge";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, TMechanic>();

export const MechanicColumns = columnHelper.columns([
    columnHelper.accessor("name", {
        header: "Nama Mekanik",
    }),
    columnHelper.accessor("phone", {
        header: "No. Telepon",
    }),
    columnHelper.accessor("is_active", {
        header: "Status",
        cell: (info) => <ServiceTypeStatusBadge isActive={info.getValue()} />,
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
                        <Link href={route("mechanics.show", serviceType.id)}>
                            <DropdownMenuItem>
                                <Eye /> Lihat Detail
                            </DropdownMenuItem>
                        </Link>

                        <Link href={route("mechanics.edit", serviceType.id)}>
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
