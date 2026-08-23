import { ArrowLeft } from "lucide-react";

import { MechanicForm } from "@/Components/Mechanics/MechanicForm";
import { Button } from "@/Components/ui/button";
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
        <div>
            <Head title={`Edit ${mechanic.name}`} />

            <div className="space-y-6 mx-auto p-6 max-w-3xl">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon">
                        <Link href={route("mechanics.index")}>
                            <ArrowLeft />
                        </Link>
                    </Button>

                    <div>
                        <h1 className="font-semibold text-2xl tracking-tight">
                            Edit Service Type
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Update service information.
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
        </div>
    );
}
