import { Search, X } from "lucide-react";
import { FormEvent, useState } from "react";

import { DataTable } from "@/Components/DataTable/DataTable";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { UserColumns } from "@/Components/Users/UserColumns";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { TUser } from "@/types/types";
import { Head, router } from "@inertiajs/react";

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface UsersPagination {
    data: TUser[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    users: UsersPagination;
    filters: {
        search: string;
    };
}

export default function Index({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");

    const handleSearch = (event: FormEvent) => {
        event.preventDefault();

        router.get(
            route("users.index"),
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
            route("users.index"),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <DashboardLayout breadcrumbs={[{ label: "Pengguna" }]}>
            <Head title="Pengguna" />

            <div className="space-y-6">
                <div>
                    <h1 className="font-semibold text-2xl tracking-tight">
                        Pengguna
                    </h1>

                    <p className="text-muted-foreground text-sm">
                        Kelola pengguna yang terdaftar di bengkel Anda.
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
                            placeholder="Cari pengguna..."
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
                    columns={UserColumns}
                    data={users.data}
                    prevPageUrl={users.prev_page_url}
                    nextPageUrl={users.next_page_url}
                    total={users.total}
                />
            </div>
        </DashboardLayout>
    );
}
