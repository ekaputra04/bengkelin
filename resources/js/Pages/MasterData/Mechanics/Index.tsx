import { Plus, Search, X } from "lucide-react";
import { FormEvent, useState } from "react";

import { DataTable } from "@/Components/DataTable/DataTable";
import { MechanicColumns } from "@/Components/Mechanics/MechanicColumns";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { TMechanic } from "@/types/types";
import { Head, Link, router } from "@inertiajs/react";

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface MechanicsPagination {
    data: TMechanic[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    mechanics: MechanicsPagination;
    filters: {
        search: string;
    };
}

export default function Index({ mechanics, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");

    const handleSearch = (event: FormEvent) => {
        event.preventDefault();

        router.get(
            route("mechanics.index"),
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
            route("mechanics.index"),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <DashboardLayout>
            <Head title="Mekanik" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="font-semibold text-2xl tracking-tight">
                            Mekanik
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Kelola mekanik yang bekerja di bengkel Anda.
                        </p>
                    </div>

                    <Link href={route("mechanics.create")}>
                        <Button>
                            <Plus className="mr-2 w-4 h-4" />
                            Tambah Mekanik
                        </Button>
                    </Link>
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
                            placeholder="Cari mekanik..."
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
                    columns={MechanicColumns}
                    data={mechanics.data}
                    prevPageUrl={mechanics.prev_page_url}
                    nextPageUrl={mechanics.next_page_url}
                    total={mechanics.total}
                />
            </div>
        </DashboardLayout>
    );
}
