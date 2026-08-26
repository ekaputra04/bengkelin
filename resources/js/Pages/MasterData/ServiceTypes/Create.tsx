import { ArrowLeft } from "lucide-react";

import { ServiceTypeForm } from "@/Components/ServiceTypes/ServiceTypeForm";
import { Button } from "@/Components/ui/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link } from "@inertiajs/react";

export default function Create() {
    return (
        <DashboardLayout
            breadcrumbs={[
                {
                    label: "Jenis Layanan",
                    href: route("admin.service-types.index"),
                },
                { label: "Tambah" },
            ]}
        >
            <Head title="Tambah Jenis Layanan" />

            <div className="space-y-6 mx-auto max-w-3xl">
                <div className="flex items-center gap-4">
                    <Link href={route("admin.service-types.index")}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft />
                        </Button>
                    </Link>

                    <div>
                        <h1 className="font-semibold text-2xl tracking-tight">
                            Tambah Jenis Layanan
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Tambahkan jenis layanan baru dalam bengkel.
                        </p>
                    </div>
                </div>

                <div className="bg-card p-6 border rounded-xl">
                    <ServiceTypeForm
                        submitUrl={route("admin.service-types.store")}
                        method="post"
                        submitLabel="Tambah Layanan Servis"
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
