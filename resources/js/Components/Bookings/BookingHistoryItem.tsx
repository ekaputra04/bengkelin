import { Calendar, Clock, User } from "lucide-react";

import BookingStatusBadge from "@/Components/Bookings/BookingStatusBadge";
import { Card, CardContent } from "@/Components/ui/card";
import { formatCurrency, formatDateTime, formatDuration } from "@/lib/utils";
import { TBooking } from "@/types/types";

interface Props {
    booking: TBooking;
}

export default function BookingHistoryItem({ booking }: Props) {
    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-4">
                    <div>
                        <p className="font-medium">
                            {booking.service_type?.name ?? "Service"}
                        </p>

                        <p className="mt-1 font-mono text-muted-foreground text-xs">
                            {booking.booking_code}
                        </p>
                    </div>

                    <BookingStatusBadge status={booking.status} />
                </div>

                <div className="gap-4 grid sm:grid-cols-3 mt-5">
                    <div className="flex items-start gap-3">
                        <Calendar className="mt-0.5 w-4 h-4 text-muted-foreground" />

                        <div>
                            <p className="text-muted-foreground text-xs">
                                Waktu Servis
                            </p>

                            <p className="mt-1 font-medium text-sm">
                                {formatDateTime(booking.start_at)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Clock className="mt-0.5 w-4 h-4 text-muted-foreground" />

                        <div>
                            <p className="text-muted-foreground text-xs">
                                Durasi
                            </p>

                            <p className="mt-1 font-medium text-sm">
                                {formatDuration(
                                    booking.start_at,
                                    booking.end_at,
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <User className="mt-0.5 w-4 h-4 text-muted-foreground" />

                        <div>
                            <p className="text-muted-foreground text-xs">
                                Mekanik
                            </p>

                            <p className="mt-1 font-medium text-sm">
                                {booking.mechanic?.name ?? "-"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-5 pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">
                            Total Biaya
                        </span>

                        <span className="font-medium">
                            {formatCurrency(
                                Number(booking.service_type?.price),
                            )}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
