import { Plus, Search, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { DataTable } from '@/Components/DataTable/DataTable';
import { BookingRequestColumns } from '@/Components/ServiceRequests/BookingRequestColumns';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { TBookingRequest } from '@/types/types';
import { Head, Link, router } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface BookingRequestsPagination {
    data: TBookingRequest[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    bookingRequests: BookingRequestsPagination;
    filters: {
        search: string;
        status?: string | null;
    };
}

const statusLabels: Record<string, string> = {
    waiting: 'Menunggu',
    processing: 'Diproses',
    converted: 'Menjadi Booking',
    expired: 'Kedaluwarsa',
    cancelled: 'Dibatalkan',
};

const items: { label: string; value: string }[] = [
    { label: 'Semua Status', value: 'all' },
    ...Object.entries(statusLabels).map(([value, label]) => ({
        label,
        value,
    })),
];

export default function Index({ bookingRequests, filters }: Props) {
    const { role } = useAuth();
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const url =
        role == 'admin'
            ? 'admin.service-requests.create'
            : 'customer.service-requests.create';

    const applyFilters = (nextSearch: string, nextStatus: string) => {
        const normalizedStatus =
            !nextStatus || nextStatus === 'all' ? undefined : nextStatus;

        router.get(
            route(role + '.service-requests.index'),
            {
                search: nextSearch || undefined,
                status: normalizedStatus,
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
        setSearch('');
        applyFilters('', status);
    };

    const handleStatusChange = (nextStatus: string) => {
        setStatus(nextStatus);
        applyFilters(search, nextStatus);
    };

    return (
        <DashboardLayout breadcrumbs={[{ label: 'Pengajuan Servis' }]}>
            <Head title="Pengajuan Servis" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="font-semibold text-2xl tracking-tight">
                            Pengajuan Servis
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Riwayat pengajuan servis dan pesanan yang
                            dihasilkan.
                        </p>
                    </div>

                    <Link href={route(url)}>
                        <Button>
                            <Plus className="mr-2 w-4 h-4" />
                            Ajukan Servis
                        </Button>
                    </Link>
                </div>

                <form
                    onSubmit={handleSearch}
                    className="flex flex-wrap items-center gap-2"
                >
                    <div className="relative flex flex-1 max-w-sm">
                        <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />

                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={
                                role === 'admin'
                                    ? 'Cari pelanggan, kendaraan, plat nomor, atau layanan...'
                                    : 'Cari kendaraan, plat nomor, atau layanan...'
                            }
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
                        value={status || 'all'}
                        onValueChange={(value) =>
                            handleStatusChange(value as string)
                        }
                    >
                        <SelectTrigger className="w-45">
                            <SelectValue>
                                {items.find(
                                    (item) =>
                                        item.value === (status || 'all'),
                                )?.label ?? 'Semua Status'}
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
                    columns={BookingRequestColumns}
                    data={bookingRequests.data}
                    prevPageUrl={bookingRequests.prev_page_url}
                    nextPageUrl={bookingRequests.next_page_url}
                    total={bookingRequests.total}
                />
            </div>
        </DashboardLayout>
    );
}
