import { Calendar, Car, Hash } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { vehicleTypeLabels } from "@/consts/consts";
import { TVehicle, TVehicleType } from "@/types/types";

interface Props {
    vehicle: TVehicle;
}

export default function VehicleInfoCard({ vehicle }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Informasi Kendaraan</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="gap-6 grid sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                        <Hash className="mt-0.5 w-5 h-5 text-muted-foreground" />

                        <div>
                            <p className="text-muted-foreground text-sm">
                                No. Polisi
                            </p>

                            <p className="mt-1 font-mono font-medium">
                                {vehicle.license_plate}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Car className="mt-0.5 w-5 h-5 text-muted-foreground" />

                        <div>
                            <p className="text-muted-foreground text-sm">
                                Kendaraan
                            </p>

                            <p className="mt-1 font-medium">
                                {vehicle.brand} {vehicle.model}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-muted-foreground text-sm">
                            Jenis Kendaraan
                        </p>

                        <p className="mt-1 font-medium">
                            {vehicleTypeLabels[
                                vehicle.vehicle_type as string
                            ] ?? vehicle.vehicle_type}
                        </p>
                    </div>

                    <div className="flex items-start gap-3">
                        <Calendar className="mt-0.5 w-5 h-5 text-muted-foreground" />

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
            </CardContent>
        </Card>
    );
}
