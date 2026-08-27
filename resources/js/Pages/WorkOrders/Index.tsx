import { Search, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { DataTable } from '@/Components/DataTable/DataTable';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from '@/Components/ui/select';
import { WorkOrderColumns } from '@/Components/WorkOrders/WorkOrderColumns';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { TWorkOrder } from '@/types/types';
import { Head, router } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface WorkOrdersPagination {
    data: TWorkOrder[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    bookings: WorkOrdersPagination;
    filters: {
        search: string;
        status?: string | null;
    };
}

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

const items: { label: string; value: string }[] = [
    {
        label: "Semua Status",
        value: "all",
    },
    ...Object.entries(statusLabels).map(([value, label]) => ({
        label,
        value,
    })),
];

export default function Index({ bookings, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [status, setStatus] = useState(filters.status ?? "");

    const applyFilters = (nextSearch: string, nextStatus: string) => {
        router.get(
            route("admin.work-orders.index"),
            {
                search: nextSearch || undefined,
                status: nextStatus || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleSearch = (event: FormEvent) => {
        event.preventDefault();

        applyFilters(search, status);
    };

    const handleClearSearch = () => {
        setSearch("");

        applyFilters("", status);
    };

    const handleStatusChange = (nextStatus: string) => {
        setStatus(nextStatus);

        applyFilters(search, nextStatus);
    };
    return (
        <DashboardLayout breadcrumbs={[{ label: "Pengerjaan Bengkel" }]}>
            <Head title="Pengerjaan Bengkel" />

            <div className="space-y-6">
                <div>
                    <h1 className="font-semibold text-2xl tracking-tight">
                        Pengerjaan Bengkel
                    </h1>

                    <p className="text-muted-foreground text-sm">
                        Pantau order yang sedang dan akan dikerjakan mekanik.
                    </p>
                </div>

                <form
                    onSubmit={handleSearch}
                    className="flex flex-wrap items-center gap-2"
                >
                    <div className="relative flex-wrap flex-1 max-w-sm">
                        <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />

                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cari kode order, pelanggan, atau plat nomor..."
                            className="pl-9"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="top-1/2 right-3 absolute text-muted-foreground hover:text-foreground -translate-y-1/2"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <Select
                        value={status}
                        onValueChange={(value) =>
                            handleStatusChange(value as string)
                        }
                    >
                        <SelectTrigger className="w-45">
                            <SelectValue>
                                {items.find((item) => item.value === status)
                                    ?.label ?? "Semua Status"}
                            </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                {items.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Button type="submit">
                        <Search />
                        Cari
                    </Button>
                </form>

                <DataTable
                    columns={WorkOrderColumns}
                    data={bookings.data}
                    prevPageUrl={bookings.prev_page_url}
                    nextPageUrl={bookings.next_page_url}
                    total={bookings.total}
                />
            </div>
        </DashboardLayout>
    );
}
