import { Plus, Search, X } from "lucide-react";
import { FormEvent, useState } from "react";

import { DataTable } from "@/Components/DataTable/DataTable";
import DialogTemplate from "@/Components/DialogTemplate";
import { DeleteServiceTypeForm } from "@/Components/ServiceTypes/DeleteServiceTypeForm";
import { ServiceTypeColumns } from "@/Components/ServiceTypes/ServiceTypeColumns";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useServiceTypeStore } from "@/stores/use-service-type-store";
import { TServiceType } from "@/types/types";
import { Head, Link, router } from "@inertiajs/react";

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ServiceTypesPagination {
    data: TServiceType[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    serviceTypes: ServiceTypesPagination;
    filters: {
        search: string;
    };
}

export default function Index({ serviceTypes, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");

    const { dialogType } = useIsDialogOpenStore();
    const { selectedData } = useServiceTypeStore();

    const handleSearch = (event: FormEvent) => {
        event.preventDefault();

        router.get(
            route("admin.service-types.index"),
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
            route("admin.service-types.index"),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <DashboardLayout breadcrumbs={[{ label: "Jenis Layanan" }]}>
            <Head title="Jenis Layanan" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="font-semibold text-2xl tracking-tight">
                            Jenis Layanan
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Kelola jenis layanan yang tersedia di bengkel Anda.
                        </p>
                    </div>

                    <Link href={route("admin.service-types.create")}>
                        <Button>
                            <Plus className="mr-2 w-4 h-4" />
                            Tambah Layanan
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
                            placeholder="Cari layanan..."
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
                    columns={ServiceTypeColumns}
                    data={serviceTypes.data}
                    prevPageUrl={serviceTypes.prev_page_url}
                    nextPageUrl={serviceTypes.next_page_url}
                    total={serviceTypes.total}
                />
            </div>
            {dialogType == "delete" && selectedData && (
                <DialogTemplate
                    title="Hapus Layanan"
                    description="Anda yakin ingin menghapus layanan ini?"
                >
                    <DeleteServiceTypeForm serviceType={selectedData} />
                </DialogTemplate>
            )}
        </DashboardLayout>
    );
}
