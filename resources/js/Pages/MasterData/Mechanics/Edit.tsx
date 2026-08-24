import { ArrowLeft } from "lucide-react";

import { MechanicForm } from "@/Components/Mechanics/MechanicForm";
import { Button } from "@/Components/ui/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { TMechanic } from "@/types/types";
import { Head, Link } from "@inertiajs/react";

interface Props {
    mechanic: TMechanic;
}

export default function Edit({ mechanic }: Props) {
    const initialData: Partial<TMechanic> = {
        name: mechanic.name,
        phone: mechanic.phone,
        is_active: mechanic.is_active,
    };

    return (
        <DashboardLayout
            breadcrumbs={[
                {
                    label: "Mekanik",
                    href: route("mechanics.index"),
                },
                {
                    label: mechanic.name,
                    href: route("mechanics.show", mechanic.id),
                },
                { label: "Edit" },
            ]}
        >
            <Head title={`Edit ${mechanic.name}`} />

            <div className="space-y-6 mx-auto max-w-3xl">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon">
                        <Link href={route("mechanics.index")}>
                            <ArrowLeft />
                        </Link>
                    </Button>

                    <div>
                        <h1 className="font-semibold text-2xl tracking-tight">
                            Edit Mekanik
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Perbarui informasi mekanik.
                        </p>
                    </div>
                </div>

                <div className="bg-card p-6 border rounded-xl">
                    <MechanicForm
                        initialData={initialData}
                        submitUrl={route("mechanics.update", mechanic.id)}
                        method="put"
                        submitLabel="Update Mekanik"
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
