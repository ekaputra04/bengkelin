import { Plus } from "lucide-react";

import { BookingRequestColumns } from "@/Components/ServiceRequests/BookingRequestColumns";
import { DataTable } from "@/Components/DataTable/DataTable";
import { Button } from "@/Components/ui/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { TBookingRequest } from "@/types/types";
import { Head, Link } from "@inertiajs/react";

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
}

export default function Index({ bookingRequests }: Props) {
    return (
        <DashboardLayout breadcrumbs={[{ label: "Pengajuan Servis" }]}>
            <Head title="Pengajuan Servis" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="font-semibold text-2xl tracking-tight">
                            Pengajuan Servis
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Riwayat pengajuan servis dan pesanan
                            yang dihasilkan.
                        </p>
                    </div>

                    <Link href={route("service-requests.create")}>
                        <Button>
                            <Plus className="mr-2 w-4 h-4" />
                            Ajukan Servis
                        </Button>
                    </Link>
                </div>

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
