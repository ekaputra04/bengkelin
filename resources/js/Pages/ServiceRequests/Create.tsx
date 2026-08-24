import { ArrowLeft } from "lucide-react";

import { ServiceRequestForm } from "@/Components/ServiceRequests/ServiceRequestForm";
import { Button } from "@/Components/ui/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { TServiceType, TVehicle } from "@/types/types";
import { Head, Link } from "@inertiajs/react";

interface Props {
    vehicles: TVehicle[];
    serviceTypes: TServiceType[];
}

export default function Create({ vehicles, serviceTypes }: Props) {
    return (
        <DashboardLayout
            breadcrumbs={[
                {
                    label: "Pengajuan Servis",
                    href: route("service-requests.index"),
                },
                { label: "Ajukan" },
            ]}
        >
            <Head title="Ajukan Servis" />

            <div className="space-y-6 mx-auto max-w-3xl">
                <div className="flex items-center gap-4">
                    <Link href={route("service-requests.index")}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft />
                        </Button>
                    </Link>

                    <div>
                        <h1 className="font-semibold text-2xl tracking-tight">
                            Ajukan Servis
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Pilih kendaraan, jenis servis, lalu
                            tentukan tanggal & jam kedatangan.
                        </p>
                    </div>
                </div>

                <div className="bg-card p-6 border rounded-xl">
                    <ServiceRequestForm
                        vehicles={vehicles}
                        serviceTypes={serviceTypes}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
