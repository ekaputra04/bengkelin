"use client";

import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";

import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useMechanicStore } from "@/stores/use-mechanic-store";
import { TMechanic } from "@/types/types";
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
            const mechanic = row.original;
            const { openDialog } = useIsDialogOpenStore();
            const { setSelectedData } = useMechanicStore();

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" className="p-0 w-8 h-8">
                            <MoreHorizontal />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <Link href={route("mechanics.show", mechanic.id)}>
                            <DropdownMenuItem>
                                <Eye /> Lihat Detail
                            </DropdownMenuItem>
                        </Link>

                        <Link href={route("mechanics.edit", mechanic.id)}>
                            <DropdownMenuItem>
                                <Pencil /> Edit
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                            onClick={() => {
                                openDialog("delete");
                                setSelectedData(mechanic);
                            }}
                        >
                            <Trash /> Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
]);
