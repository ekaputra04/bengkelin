import { bookingStatusConfig } from '@/consts/consts';
import { cn, getTimeInMinutes } from '@/lib/utils';
import { useBookingStore } from '@/stores/use-booking-store';
import { useIsDialogOpenStore } from '@/stores/use-is-open-dialog-store';
import { TBooking, TBookingStatus, TMechanicWorkProgress, TWorkOrder } from '@/types/types';

import BookingDetail from '../Bookings/BookingDetail';
import DialogTemplate from '../DialogTemplate';

interface Props {
    mechanics: TMechanicWorkProgress[];
    selectedDate: string;
}

const START_HOUR = 6;
const END_HOUR = 18;

const SLOT_MINUTES = 30;
const SLOT_WIDTH = 100;

const timelineStartMinutes = START_HOUR * 60;
const timelineEndMinutes = END_HOUR * 60;

const statusLabels: Record<string, string> = {
    pending_payment: "Menunggu DP",
    confirmed: "Terjadwal",
    in_progress: "Dikerjakan",
    completed: "Selesai",
    cancelled: "Dibatalkan",
    expired: "Kedaluwarsa",
    no_show: "Tidak Datang",
};

function getMinutes(date: string) {
    return getTimeInMinutes(date);
}

function formatTimeFromMinutes(totalMinutes: number) {
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0",
    )}`;
}

function getBookingStyle(booking: TBooking) {
    const start = getMinutes(booking.start_at);
    const end = getMinutes(booking.end_at);

    const left = ((start - timelineStartMinutes) / SLOT_MINUTES) * SLOT_WIDTH;

    const width = ((end - start) / SLOT_MINUTES) * SLOT_WIDTH;

    return {
        left,
        width: Math.max(width, 60),
    };
}

export default function WorkProgressTimeline({ mechanics }: Props) {
    const totalSlots =
        (timelineEndMinutes - timelineStartMinutes) / SLOT_MINUTES;

    const timelineWidth = totalSlots * SLOT_WIDTH;

    const { selectedData, setSelectedData } = useBookingStore();

    const { dialogType, openDialog } = useIsDialogOpenStore();

    return (
        <div className="space-y-4">
            {/* Timeline */}
            <div className="bg-card border rounded-xl overflow-x-auto">
                <div
                    className="min-w-max"
                    style={{
                        width: 180 + timelineWidth,
                    }}
                >
                    {/* Header */}
                    <div className="flex bg-muted/40 border-b">
                        {/* Mechanic column */}
                        <div className="left-0 z-20 sticky flex items-center bg-muted/40 px-4 border-r w-45 h-12 shrink-0">
                            <span className="font-medium text-sm">Mekanik</span>
                        </div>

                        {/* Timeline header */}
                        <div
                            className="relative h-12"
                            style={{
                                width: timelineWidth,
                            }}
                        >
                            {Array.from(
                                {
                                    length: totalSlots + 1,
                                },
                                (_, index) => {
                                    const minutes =
                                        timelineStartMinutes +
                                        index * SLOT_MINUTES;

                                    return (
                                        <div
                                            key={minutes}
                                            className="top-0 absolute flex items-center px-2 border-r h-full"
                                            style={{
                                                left: index * SLOT_WIDTH,
                                                width: SLOT_WIDTH,
                                            }}
                                        >
                                            <span className="text-muted-foreground text-xs">
                                                {formatTimeFromMinutes(minutes)}
                                            </span>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </div>

                    {/* Mechanics */}
                    {mechanics.map((mechanic) => (
                        <div
                            key={mechanic.id}
                            className="flex border-b last:border-b-0"
                        >
                            {/* Mechanic */}
                            <div className="left-0 z-10 sticky flex items-center bg-card px-4 border-r w-45 h-24 shrink-0">
                                <div>
                                    <p className="font-medium text-sm">
                                        {mechanic.name}
                                    </p>

                                    <p className="mt-1 text-muted-foreground text-xs">
                                        {mechanic.bookings.length} pekerjaan
                                    </p>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div
                                className="relative h-24"
                                style={{
                                    width: timelineWidth,
                                }}
                            >
                                {/* Grid */}
                                <div className="absolute inset-0 flex">
                                    {Array.from(
                                        {
                                            length: totalSlots,
                                        },
                                        (_, index) => (
                                            <div
                                                key={index}
                                                className={cn(
                                                    "border-r h-full",
                                                    index % 2 === 0
                                                        ? "bg-background"
                                                        : "bg-muted/10",
                                                )}
                                                style={{
                                                    width: SLOT_WIDTH,
                                                }}
                                            />
                                        ),
                                    )}
                                </div>

                                {/* Bookings */}
                                {mechanic.bookings.map((booking) => {
                                    const { left, width } =
                                        getBookingStyle(booking);

                                    const statusConfig =
                                        bookingStatusConfig[booking.status];

                                    return (
                                        <div
                                            key={booking.id}
                                            className={cn(
                                                "top-3 absolute shadow-sm px-3 py-2 border rounded-lg h-18 overflow-hidden hover:cursor-pointer",
                                                statusConfig?.className ??
                                                    "border-border bg-muted",
                                            )}
                                            onClick={() => {
                                                setSelectedData(booking);

                                                openDialog("show");
                                            }}
                                            style={{
                                                left,
                                                width,
                                            }}
                                        >
                                            <p className="font-semibold text-xs truncate">
                                                {booking.service_type?.name}
                                            </p>

                                            <p className="mt-1 text-xs truncate">
                                                {booking.vehicle?.license_plate}
                                            </p>

                                            <p className="opacity-70 mt-1 text-[11px] truncate">
                                                {formatTimeFromMinutes(
                                                    getMinutes(
                                                        booking.start_at,
                                                    ),
                                                )}{" "}
                                                -{" "}
                                                {formatTimeFromMinutes(
                                                    getMinutes(booking.end_at),
                                                )}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex md:justify-end">
                <div className="flex flex-wrap justify-start md:justify-end gap-x-5 gap-y-2">
                    {Object.entries(statusLabels).map(([status, label]) => {
                        const config =
                            bookingStatusConfig[status as TBookingStatus];

                        return (
                            <div
                                key={status}
                                className="flex items-center gap-2"
                            >
                                <span
                                    className={cn(
                                        "border rounded-sm w-3 h-3 shrink-0",
                                        config?.className ??
                                            "bg-muted border-border",
                                    )}
                                />

                                <span className="text-muted-foreground text-xs">
                                    {label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {dialogType === "show" && selectedData && (
                <DialogTemplate
                    className="max-w-[90vw] max-h-[90vh] overflow-y-auto"
                    title="Detail Layanan"
                    description="Informasi detail pengerjaan layanan."
                >
                    <BookingDetail booking={selectedData as TWorkOrder} />
                </DialogTemplate>
            )}
        </div>
    );
}
