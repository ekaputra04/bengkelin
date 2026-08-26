"use client";

import { Eye, MoreHorizontal } from "lucide-react";

import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { vehicleTypeLabels } from "@/consts/consts";
import { TVehicle } from "@/types/types";
import { Link } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";

import { DataTableFeatures } from "../DataTable/DataTableFeatures";

const columnHelper = createColumnHelper<DataTableFeatures, TVehicle>();

export const VehicleColumns = columnHelper.columns([
    columnHelper.accessor("license_plate", {
        header: "No. Polisi",
        cell: (info) => (
            <span className="font-mono text-sm">{info.getValue()}</span>
        ),
    }),
    columnHelper.accessor("brand", {
        header: "Merek",
    }),
    columnHelper.accessor("model", {
        header: "Model",
    }),
    columnHelper.accessor("vehicle_type", {
        header: "Jenis",
        cell: (info) =>
            vehicleTypeLabels[info.getValue() as string] ?? info.getValue(),
    }),
    columnHelper.accessor("year", {
        header: "Tahun",
        cell: (info) => info.getValue() ?? "-",
    }),
    columnHelper.display({
        header: "Aksi",
        cell: ({ row }) => {
            const vehicle = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" className="p-0 w-8 h-8">
                            <MoreHorizontal />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <Link href={route("vehicles.show", vehicle.id)}>
                            <DropdownMenuItem>
                                <Eye /> Lihat Detail
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
]);
