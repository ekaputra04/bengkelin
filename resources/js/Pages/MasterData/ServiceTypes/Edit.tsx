import { ArrowLeft } from "lucide-react";

import { ServiceTypeForm } from "@/Components/ServiceTypes/ServiceTypeForm";
import { Button } from "@/Components/ui/button";
import { TServiceType } from "@/types/types";
import { Head, Link } from "@inertiajs/react";

interface Props {
    serviceType: TServiceType;
}

export default function Edit({ serviceType }: Props) {
    const initialData: Partial<TServiceType> = {
        name: serviceType.name,
        description: serviceType.description ?? "",
        duration_minutes: serviceType.duration_minutes,
        price: Number(serviceType.price),
        dp_amount: Number(serviceType.dp_amount),
        is_active: serviceType.is_active,
    };

    return (
        <div>
            <Head title={`Edit ${serviceType.name}`} />

            <div className="space-y-6 mx-auto p-6 max-w-3xl">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon">
                        <Link href={route("service-types.index")}>
                            <ArrowLeft />
                        </Link>
                    </Button>

                    <div>
                        <h1 className="font-semibold text-2xl tracking-tight">
                            Edit Jenis Layanan
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Perbarui informasi jenis layanan.
                        </p>
                    </div>
                </div>

                <div className="bg-card p-6 border rounded-xl">
                    <ServiceTypeForm
                        initialData={initialData}
                        submitUrl={route(
                            "service-types.update",
                            serviceType.id,
                        )}
                        method="put"
                        submitLabel="Update Jenis Layanan"
                    />
                </div>
            </div>
        </div>
    );
}
