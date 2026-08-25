import { ArrowLeft } from "lucide-react";

import { Button } from "@/Components/ui/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { TVehicle } from "@/types/types";
import { Head, Link } from "@inertiajs/react";

interface Props {
    vehicle: TVehicle;
}

const vehicleTypeLabels: Record<string, string> = {
    motorcycle: "Sepeda Motor",
    car: "Mobil",
};

export default function Show({ vehicle }: Props) {
    return (
        <DashboardLayout
            breadcrumbs={[
                {
                    label: "Kendaraan",
                    href: route("vehicles.index"),
                },
                { label: vehicle.license_plate },
            ]}
        >
            <Head title={vehicle.license_plate} />

            <div className="space-y-6 mx-auto max-w-3xl">
                <div className="flex items-center gap-4">
                    <Link href={route("vehicles.index")}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft />
                        </Button>
                    </Link>

                    <div>
                        <h1 className="font-semibold text-2xl">
                            {vehicle.license_plate}
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Detail kendaraan
                        </p>
                    </div>
                </div>

                <div className="bg-card border rounded-xl">
                    <div className="space-y-6 p-6">
                        <div>
                            <p className="text-muted-foreground text-sm">
                                No. Polisi
                            </p>

                            <p className="mt-1 font-mono font-medium">
                                {vehicle.license_plate}
                            </p>
                        </div>

                        <div>
                            <p className="text-muted-foreground text-sm">
                                Merek
                            </p>

                            <p className="mt-1 font-medium">{vehicle.brand}</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground text-sm">
                                Model
                            </p>

                            <p className="mt-1 font-medium">{vehicle.model}</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground text-sm">
                                Jenis
                            </p>

                            <p className="mt-1 font-medium">
                                {vehicleTypeLabels[vehicle.vehicle_type] ??
                                    vehicle.vehicle_type}
                            </p>
                        </div>

                        <div>
                            <p className="text-muted-foreground text-sm">
                                Tahun
                            </p>

                            <p className="mt-1 font-medium">
                                {vehicle.year ?? "-"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
