import { Plus } from "lucide-react";

import { DataTable } from "@/Components/DataTable/DataTable";
import { ServiceTypeColumns } from "@/Components/ServiceTypes/ServiceTypeColumns";
import { Button } from "@/Components/ui/button";
import { TServiceType } from "@/types/types";
import { Head, Link } from "@inertiajs/react";

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
}

interface Props {
    serviceTypes: ServiceTypesPagination;
}

export default function Index({ serviceTypes }: Props) {
    return (
        <div>
            <Head title="Service Types" />

            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="font-semibold text-2xl tracking-tight">
                            Service Types
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Manage available vehicle services.
                        </p>
                    </div>

                    <Link href={route("service-types.create")}>
                        <Button>
                            <Plus className="mr-2 w-4 h-4" />
                            Add Service
                        </Button>
                    </Link>
                </div>
                <pre>{JSON.stringify(serviceTypes.data, null, 2)}</pre>
                <DataTable
                    columns={ServiceTypeColumns}
                    data={serviceTypes.data}
                />
            </div>
        </div>
    );
}
