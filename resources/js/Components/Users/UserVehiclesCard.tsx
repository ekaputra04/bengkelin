import { Car, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { vehicleTypeLabels } from "@/consts/consts";
import { TUser, TVehicle } from "@/types/types";
import { Link } from "@inertiajs/react";

interface Props {
    user: TUser;
}

function VehicleItem({ vehicle }: { vehicle: TVehicle }) {
    return (
        <Link
            href={route("admin.vehicles.show", vehicle.id)}
            className="group block"
        >
            <div className="flex justify-between items-center hover:bg-muted/50 p-4 border rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                    <div className="flex justify-center items-center bg-muted rounded-lg w-11 h-11">
                        <Car className="w-5 h-5 text-muted-foreground" />
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-medium">
                                {vehicle.brand} {vehicle.model}
                            </p>

                            <span className="bg-muted px-2 py-0.5 rounded-md text-muted-foreground text-xs">
                                {vehicleTypeLabels[vehicle.vehicle_type ?? ""]}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                            <span className="font-mono">
                                {vehicle.license_plate}
                            </span>

                            {vehicle.year && (
                                <>
                                    <span>•</span>
                                    <span>{vehicle.year}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    );
}

export default function UserVehiclesCard({ user }: Props) {
    const vehicles = user.vehicles ?? [];

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Kendaraan</CardTitle>

                    <p className="mt-1 text-muted-foreground text-sm">
                        Kendaraan yang terdaftar pada akun
                    </p>
                </div>

                <div className="bg-muted px-3 py-1 rounded-full font-medium text-sm">
                    {vehicles.length}
                </div>
            </CardHeader>

            <CardContent>
                {vehicles.length === 0 ? (
                    <div className="flex flex-col justify-center items-center border border-dashed rounded-xl min-h-32 text-center">
                        <Car className="mb-3 w-8 h-8 text-muted-foreground" />

                        <p className="font-medium">Belum ada kendaraan</p>

                        <p className="mt-1 text-muted-foreground text-sm">
                            Pengguna belum memiliki kendaraan terdaftar.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {vehicles.map((vehicle) => (
                            <VehicleItem key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
