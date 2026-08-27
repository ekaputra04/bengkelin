"use client";
import { Button } from '@/Components/ui/button';
import { TBookingRequest } from '@/types/types';
import { router } from '@inertiajs/react';

interface Props {
    bookingRequest: TBookingRequest;
}

export default function BookingRequestActions({ bookingRequest }: Props) {
    const updateStatus = (status: "processing" | "cancelled") => {
        router.patch(
            route("admin.service-requests.update-status", bookingRequest.id),
            { status },
            {
                preserveScroll: true,
            },
        );
    };

    if (
        bookingRequest.status == "processing" ||
        bookingRequest.status == "waiting"
    ) {
        return (
            <Button
                variant="destructive"
                onClick={() => updateStatus("cancelled")}
                size={"sm"}
            >
                Batalkan Pengajuan
            </Button>
        );
    }

    return null;
}
