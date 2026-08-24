import { ArrowLeft } from "lucide-react";

import { MechanicForm } from "@/Components/Mechanics/MechanicForm";
import { Button } from "@/Components/ui/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link } from "@inertiajs/react";

export default function Create() {
    return (
        <DashboardLayout
            breadcrumbs={[
                {
                    label: "Mekanik",
                    href: route("mechanics.index"),
                },
                { label: "Tambah" },
            ]}
        >
            <Head title="Tambah Mekanik" />

            <div className="space-y-6 mx-auto max-w-3xl">
                <div className="flex items-center gap-4">
                    <Link href={route("mechanics.index")}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft />
                        </Button>
                    </Link>

                    <div>
                        <h1 className="font-semibold text-2xl tracking-tight">
                            Tambah Mekanik
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Tambahkan mekanik baru dalam bengkel.
                        </p>
                    </div>
                </div>

                <div className="bg-card p-6 border rounded-xl">
                    <MechanicForm
                        submitUrl={route("mechanics.store")}
                        method="post"
                        submitLabel="Tambah Mekanik"
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
