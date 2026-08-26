"use client";

import { Eye, MoreHorizontal } from "lucide-react";

import { ServiceTypeStatusBadge } from "@/Components/ServiceTypes/ServiceTypeStatusBadge";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { UserRoleBadge } from "@/Components/Users/UserRoleBadge";
import { TUser } from "@/types/types";
import { Link } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";

import { DataTableFeatures } from "../DataTable/DataTableFeatures";

const columnHelper = createColumnHelper<DataTableFeatures, TUser>();

export const UserColumns = columnHelper.columns([
    columnHelper.accessor("name", {
        header: "Nama",
    }),
    columnHelper.accessor("email", {
        header: "Email",
    }),
    columnHelper.accessor("role", {
        header: "Role",
        cell: (info) => <UserRoleBadge role={info.getValue()} />,
    }),
    columnHelper.accessor("is_active", {
        header: "Status",
        cell: (info) => <ServiceTypeStatusBadge isActive={info.getValue()} />,
    }),
    columnHelper.display({
        header: "Aksi",
        cell: ({ row }) => {
            const user = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" className="p-0 w-8 h-8">
                            <MoreHorizontal />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <Link href={route("admin.users.show", user.id)}>
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
