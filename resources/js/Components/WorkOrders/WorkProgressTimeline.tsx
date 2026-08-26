import { bookingStatusConfig } from '@/consts/consts';
import { cn } from '@/lib/utils';
import { useBookingStore } from '@/stores/use-booking-store';
import { useIsDialogOpenStore } from '@/stores/use-is-open-dialog-store';
import { TBooking, TBookingStatus, TMechanicWorkProgress, TWorkOrder } from '@/types/types';

import BookingDetail from '../Bookings/BookingDetail';
import DialogTemplate from '../DialogTemplate';

export const workProgressBookings: TBooking[] = [
    {
        id: 1,
        booking_code: "BK-20260825-001",
        booking_request_id: 1,

        user_id: 11,
        vehicle_id: 6,
        service_type_id: 6,
        mechanic_user_id: 3,

        start_at: "2026-08-25T08:00:00+08:00",
        end_at: "2026-08-25T09:00:00+08:00",

        service_price: 100000,
        dp_amount: 40000,
        remaining_amount: 60000,

        status: "completed",

        confirmed_at: "2026-08-25T07:50:00+08:00",
        completed_at: "2026-08-25T09:00:00+08:00",
        cancelled_at: null,
        no_show_at: null,
        paid_at: "2026-08-25T07:55:00+08:00",
        notes: null,

        vehicle: {
            id: 6,
            license_plate: "B1122PQR",
            brand: "Toyota",
            model: "Avanza",
            vehicle_type: "car",
            year: 2020,
        },

        service_type: {
            id: 6,
            name: "Ganti Oli",
            description: "Penggantian oli mesin standar pabrik",
            duration_minutes: 60,
            price: 100000,
            dp_amount: 40000,
            is_active: true,
        },

        mechanic: {
            id: 3,
            name: "Budi",
            email: "budi@example.com",
            role: "mechanic",
            is_active: true,
        },
    },

    {
        id: 2,
        booking_code: "BK-20260825-002",
        booking_request_id: 2,

        user_id: 12,
        vehicle_id: 7,
        service_type_id: 3,
        mechanic_user_id: 3,

        start_at: "2026-08-25T09:00:00+08:00",
        end_at: "2026-08-25T11:00:00+08:00",

        service_price: 350000,
        dp_amount: 100000,
        remaining_amount: 250000,

        status: "in_progress",

        confirmed_at: "2026-08-25T08:30:00+08:00",
        completed_at: null,
        cancelled_at: null,
        no_show_at: null,
        paid_at: "2026-08-25T08:35:00+08:00",
        notes: null,

        vehicle: {
            id: 7,
            license_plate: "DK4567ABC",
            brand: "Honda",
            model: "CR-V",
            vehicle_type: "car",
            year: 2022,
        },

        service_type: {
            id: 3,
            name: "Full Service",
            description:
                "Pemeriksaan dan perawatan kendaraan secara menyeluruh",
            duration_minutes: 120,
            price: 350000,
            dp_amount: 100000,
            is_active: true,
        },

        mechanic: {
            id: 3,
            name: "Budi",
            email: "budi@example.com",
            role: "mechanic",
            is_active: true,
        },
    },

    {
        id: 3,
        booking_code: "BK-20260825-003",
        booking_request_id: 3,

        user_id: 13,
        vehicle_id: 8,
        service_type_id: 7,
        mechanic_user_id: 4,

        start_at: "2026-08-25T08:00:00+08:00",
        end_at: "2026-08-25T08:30:00+08:00",

        service_price: 200000,
        dp_amount: 60000,
        remaining_amount: 140000,

        status: "completed",

        confirmed_at: "2026-08-25T07:40:00+08:00",
        completed_at: "2026-08-25T08:30:00+08:00",
        cancelled_at: null,
        no_show_at: null,
        paid_at: "2026-08-25T07:45:00+08:00",
        notes: null,

        vehicle: {
            id: 8,
            license_plate: "DK8899XYZ",
            brand: "Toyota",
            model: "Yaris",
            vehicle_type: "car",
            year: 2021,
        },

        service_type: {
            id: 7,
            name: "Tune Up",
            description: "Pemeriksaan dan penyetelan komponen mesin kendaraan",
            duration_minutes: 30,
            price: 200000,
            dp_amount: 60000,
            is_active: true,
        },

        mechanic: {
            id: 4,
            name: "Andi",
            email: "andi@example.com",
            role: "mechanic",
            is_active: true,
        },
    },

    {
        id: 4,
        booking_code: "BK-20260825-004",
        booking_request_id: 4,

        user_id: 14,
        vehicle_id: 9,
        service_type_id: 4,
        mechanic_user_id: 4,

        start_at: "2026-08-25T08:30:00+08:00",
        end_at: "2026-08-25T10:00:00+08:00",

        service_price: 120000,
        dp_amount: 50000,
        remaining_amount: 70000,

        status: "in_progress",

        confirmed_at: "2026-08-25T08:15:00+08:00",
        completed_at: null,
        cancelled_at: null,
        no_show_at: null,
        paid_at: "2026-08-25T08:20:00+08:00",
        notes: null,

        vehicle: {
            id: 9,
            license_plate: "DK2233LMN",
            brand: "Honda",
            model: "Vario 160",
            vehicle_type: "motorcycle",
            year: 2023,
        },

        service_type: {
            id: 4,
            name: "Servis Berkala",
            description:
                "Perawatan rutin kendaraan berdasarkan interval servis",
            duration_minutes: 90,
            price: 120000,
            dp_amount: 50000,
            is_active: true,
        },

        mechanic: {
            id: 4,
            name: "Andi",
            email: "andi@example.com",
            role: "mechanic",
            is_active: true,
        },
    },

    {
        id: 5,
        booking_code: "BK-20260825-005",
        booking_request_id: 5,

        user_id: 15,
        vehicle_id: 10,
        service_type_id: 6,
        mechanic_user_id: 5,

        start_at: "2026-08-25T09:00:00+08:00",
        end_at: "2026-08-25T10:00:00+08:00",

        service_price: 100000,
        dp_amount: 40000,
        remaining_amount: 60000,

        status: "confirmed",

        confirmed_at: "2026-08-25T08:45:00+08:00",
        completed_at: null,
        cancelled_at: null,
        no_show_at: null,
        paid_at: "2026-08-25T08:50:00+08:00",
        notes: null,

        vehicle: {
            id: 10,
            license_plate: "DK9988AAA",
            brand: "Toyota",
            model: "Innova",
            vehicle_type: "car",
            year: 2022,
        },

        service_type: {
            id: 6,
            name: "Ganti Oli",
            description: "Penggantian oli mesin standar pabrik",
            duration_minutes: 60,
            price: 100000,
            dp_amount: 40000,
            is_active: true,
        },

        mechanic: {
            id: 5,
            name: "Citra",
            email: "citra@example.com",
            role: "mechanic",
            is_active: true,
        },
    },

    {
        id: 6,
        booking_code: "BK-20260825-006",
        booking_request_id: 6,

        user_id: 16,
        vehicle_id: 11,
        service_type_id: 7,
        mechanic_user_id: 5,

        start_at: "2026-08-25T10:00:00+08:00",
        end_at: "2026-08-25T11:30:00+08:00",

        service_price: 200000,
        dp_amount: 60000,
        remaining_amount: 140000,

        status: "confirmed",

        confirmed_at: "2026-08-25T09:45:00+08:00",
        completed_at: null,
        cancelled_at: null,
        no_show_at: null,
        paid_at: "2026-08-25T09:50:00+08:00",
        notes: null,

        vehicle: {
            id: 11,
            license_plate: "DK1111BBB",
            brand: "Mitsubishi",
            model: "Xpander",
            vehicle_type: "car",
            year: 2023,
        },

        service_type: {
            id: 7,
            name: "Tune Up",
            description: "Pemeriksaan dan penyetelan komponen mesin kendaraan",
            duration_minutes: 90,
            price: 200000,
            dp_amount: 60000,
            is_active: true,
        },

        mechanic: {
            id: 5,
            name: "Citra",
            email: "citra@example.com",
            role: "mechanic",
            is_active: true,
        },
    },
];

interface Props {
    mechanics: TMechanicWorkProgress[];
    selectedDate: string;
}

const START_HOUR = 1;
const END_HOUR = 24;

const SLOT_MINUTES = 30;
const SLOT_WIDTH = 100;

const timelineStartMinutes = START_HOUR * 60;
const timelineEndMinutes = END_HOUR * 60;

function getMinutes(date: string) {
    const value = new Date(date);

    return value.getHours() * 60 + value.getMinutes();
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
        <div className="">
            <div className="bg-card border rounded-xl overflow-x-auto">
                <div
                    className="min-w-max"
                    style={{
                        width: 180 + timelineWidth,
                    }}
                >
                    <div className="flex bg-muted/40 border-b">
                        <div className="left-0 z-20 sticky flex items-center bg-muted/40 px-4 py-3 border-r w-45 shrink-0">
                            <span className="font-medium text-sm">Mekanik</span>
                        </div>

                        <div
                            className="relative h-12"
                            style={{
                                width: timelineWidth,
                            }}
                        >
                            {Array.from(
                                { length: totalSlots + 1 },
                                (_, index) => {
                                    const minutes =
                                        timelineStartMinutes +
                                        index * SLOT_MINUTES;

                                    const hour = Math.floor(minutes / 60);

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
                                                {formatTimeFromMinutes(
                                                    hour * 60,
                                                )}
                                            </span>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </div>

                    {mechanics.map((mechanic) => {
                        return (
                            <div
                                key={mechanic?.id}
                                className="flex border-b last:border-b-0"
                            >
                                <div className="left-0 z-10 sticky flex items-center bg-card px-4 border-r w-45 h-24 shrink-0">
                                    <div>
                                        <p className="font-medium text-sm">
                                            {mechanic?.name}
                                        </p>

                                        <p className="mt-1 text-muted-foreground text-xs">
                                            {mechanic.bookings.length} pekerjaan
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="relative h-24"
                                    style={{
                                        width: timelineWidth,
                                    }}
                                >
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

                                    {mechanic.bookings.map((booking) => {
                                        const { left, width } =
                                            getBookingStyle(booking);

                                        return (
                                            <div
                                                key={booking.id}
                                                className={cn(
                                                    "top-3 absolute shadow-sm px-3 py-2 border rounded-lg h-18 overflow-hidden hover:cursor-pointer",

                                                    bookingStatusConfig[
                                                        booking.status
                                                    ].className ??
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
                                                    {
                                                        booking.vehicle
                                                            ?.license_plate
                                                    }
                                                </p>

                                                <p className="opacity-70 mt-1 text-[11px] truncate">
                                                    {formatTimeFromMinutes(
                                                        getMinutes(
                                                            booking.start_at,
                                                        ),
                                                    )}{" "}
                                                    -{" "}
                                                    {formatTimeFromMinutes(
                                                        getMinutes(
                                                            booking.end_at,
                                                        ),
                                                    )}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {dialogType == "show" && selectedData && (
                <DialogTemplate
                    className="max-w-[90hw] max-h-[90vh] overflow-y-auto"
                    title="Detail Layanan"
                    description="Informasi detail pengerjaan layanan."
                >
                    <BookingDetail booking={selectedData as TWorkOrder} />
                </DialogTemplate>
            )}
        </div>
    );
}
