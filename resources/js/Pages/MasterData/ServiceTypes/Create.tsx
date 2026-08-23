import { ArrowLeft } from "lucide-react";

import { ServiceTypeForm } from "@/Components/ServiceTypes/ServiceTypeForm";
import { Button } from "@/Components/ui/button";
import { Head, Link } from "@inertiajs/react";

export default function Create() {
    return (
        <div>
            <Head title="Create Service Type" />

            <div className="space-y-6 mx-auto p-6 max-w-3xl">
                <div className="flex items-center gap-4">
                    <Link href={route("service-types.index")}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft />
                        </Button>
                    </Link>

                    <div>
                        <h1 className="font-semibold text-2xl tracking-tight">
                            Tambah Layanan Servis
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Tambahkan layanan servis baru dalam bengkel.
                        </p>
                    </div>
                </div>

                <div className="bg-card p-6 border rounded-xl">
                    <ServiceTypeForm
                        submitUrl={route("service-types.store")}
                        method="post"
                        submitLabel="Tambah Layanan Servis"
                    />
                </div>
            </div>
        </div>
    );
}
