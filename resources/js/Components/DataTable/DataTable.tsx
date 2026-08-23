"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { router } from "@inertiajs/react";
import { ColumnDef, RowData, useTable } from "@tanstack/react-table";

import { Button } from "../ui/button";
import { DataTableFeatures, features } from "./DataTableFeatures";

interface DataTableProps<TData extends RowData> {
    columns: ColumnDef<DataTableFeatures, TData>[];
    data: TData[];
    prevPageUrl?: string | null;
    nextPageUrl?: string | null;
    total?: number;
}

export function DataTable<TData extends RowData>({
    columns,
    data,
    prevPageUrl,
    nextPageUrl,
    total,
}: DataTableProps<TData>) {
    const table = useTable({
        features,
        data,
        columns,
    });

    return (
        <div className="border rounded-md overflow-hidden">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <table.FlexRender header={header} />
                                        )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        <table.FlexRender cell={cell} />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center">
                <div className="text-muted-foreground text-sm">
                    Menampilkan {data.length} dari {total} data
                </div>
                <div className="flex justify-between items-center space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (prevPageUrl) {
                                router.visit(prevPageUrl);
                            }
                        }}
                        disabled={prevPageUrl == null}
                    >
                        <ArrowLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (nextPageUrl) {
                                router.visit(nextPageUrl);
                            }
                        }}
                        disabled={nextPageUrl == null}
                    >
                        <ArrowRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}
