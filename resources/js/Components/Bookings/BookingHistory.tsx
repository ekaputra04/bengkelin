import { ClipboardList } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { TVehicle } from "@/types/types";

import BookingHistoryItem from "./BookingHistoryItem";

interface Props {
    vehicle: TVehicle;
}

export default function BookingHistory({ vehicle }: Props) {
    const bookings = vehicle.bookings ?? [];

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Riwayat Servis</CardTitle>

                        <p className="mt-1 text-muted-foreground text-sm">
                            Riwayat servis kendaraan
                        </p>
                    </div>

                    <div className="flex justify-center items-center bg-muted rounded-lg w-9 h-9">
                        <ClipboardList className="w-4 h-4" />
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {bookings.length === 0 ? (
                    <div className="flex flex-col justify-center items-center min-h-32 text-center">
                        <ClipboardList className="mb-3 w-8 h-8 text-muted-foreground" />

                        <p className="font-medium">Belum ada riwayat servis</p>

                        <p className="mt-1 text-muted-foreground text-sm">
                            Kendaraan ini belum memiliki riwayat servis.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <BookingHistoryItem
                                key={booking.id}
                                booking={booking}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
