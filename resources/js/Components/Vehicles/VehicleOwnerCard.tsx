import { Mail, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { TVehicle } from "@/types/types";

interface Props {
    vehicle: TVehicle;
}

export default function VehicleOwnerCard({ vehicle }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pemilik</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground text-sm">Nama</p>
                        <p className="font-medium">
                            {vehicle.user?.name ?? "-"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />

                    <div>
                        <p className="text-muted-foreground text-sm">Email</p>

                        <p className="font-medium">
                            {vehicle.user?.email ?? "-"}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
