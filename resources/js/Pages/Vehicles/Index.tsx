import { Search, X } from "lucide-react";
import { FormEvent, useState } from "react";

import { DataTable } from "@/Components/DataTable/DataTable";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { VehicleColumns } from "@/Components/Vehicles/VehicleColumns";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { TVehicle } from "@/types/types";
import { Head, router, usePage } from "@inertiajs/react";

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface VehiclesPagination {
    data: TVehicle[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    vehicles: VehiclesPagination;
    filters: {
        search: string;
    };
}

export default function Index({ vehicles, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");
    const { props } = usePage();
    const user = (props as any).auth.user;
    const isAdmin = user.role === "admin";

    const handleSearch = (event: FormEvent) => {
        event.preventDefault();

        router.get(
            route("vehicles.index"),
            {
                search: search || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleClearSearch = () => {
        setSearch("");

        router.get(
            route("vehicles.index"),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <DashboardLayout breadcrumbs={[{ label: "Kendaraan" }]}>
            <Head title="Kendaraan" />

            <div className="space-y-6">
                <div>
                    <h1 className="font-semibold text-2xl tracking-tight">
                        Kendaraan
                    </h1>

                    <p className="text-muted-foreground text-sm">
                        {isAdmin
                            ? "Daftar seluruh kendaraan yang terdaftar di bengkel."
                            : "Daftar kendaraan milik Anda."}
                    </p>
                </div>

                <form
                    onSubmit={handleSearch}
                    className="flex items-center gap-2"
                >
                    <div className="relative flex-1 max-w-sm">
                        <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />

                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cari plat nomor, merek, atau model..."
                            className="pr-10 pl-9"
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

                    <Button type="submit">
                        <Search />
                        Cari
                    </Button>
                </form>

                <DataTable
                    columns={VehicleColumns}
                    data={vehicles.data}
                    prevPageUrl={vehicles.prev_page_url}
                    nextPageUrl={vehicles.next_page_url}
                    total={vehicles.total}
                />
            </div>
        </DashboardLayout>
    );
}
