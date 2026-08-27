import { CalendarDays, Car, Clock3, CreditCard, FileText, Wrench } from 'lucide-react';

import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { vehicleTypeLabels } from '@/consts/consts';
import { formatCurrency, formatDate, formatDateTime, formatTime } from '@/lib/utils';
import { TBooking, TWorkOrder } from '@/types/types';

import DetailItem from '../ItemDetail';
import { PaymentBadge } from '../PaymentBadge';
import { WorkOrderActions } from '../WorkOrders/WorkOrderActions';
import BookingStatusBadge from './BookingStatusBadge';

interface Props {
    booking: TWorkOrder;
}

export default function BookingDetail({ booking }: Props) {
    const serviceType = booking.service_type;
    const vehicle = booking.vehicle;

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start gap-4">
                <div>
                    <p className="text-muted-foreground text-xs">
                        Kode Booking
                    </p>

                    <h2 className="mt-1 font-mono font-semibold text-lg">
                        {booking.booking_code}
                    </h2>
                </div>

                <div className="flex flex-col gap-2">
                    <BookingStatusBadge status={booking.status} />
                    <PaymentBadge booking={booking as TWorkOrder} />
                </div>
            </div>

            <Separator />

            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />

                    <h3 className="font-semibold text-sm">Jadwal Servis</h3>
                </div>

                <div className="gap-4 grid grid-cols-2">
                    <DetailItem
                        label="Tanggal"
                        value={formatDate(booking.start_at)}
                    />

                    <DetailItem
                        label="Waktu"
                        value={
                            <span className="flex items-center gap-1.5">
                                <Clock3 className="w-3.5 h-3.5 text-muted-foreground" />
                                {formatTime(booking.start_at)} -{" "}
                                {formatTime(booking.end_at)}
                            </span>
                        }
                    />

                    <DetailItem
                        label="Durasi (estimasi)"
                        value={
                            serviceType
                                ? `${serviceType.duration_minutes} menit`
                                : "-"
                        }
                    />

                    <DetailItem
                        label="Dikonfirmasi"
                        value={
                            booking.confirmed_at
                                ? formatDateTime(booking.confirmed_at)
                                : "-"
                        }
                    />
                </div>
            </section>

            <Separator />

            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-muted-foreground" />

                    <h3 className="font-semibold text-sm">Layanan</h3>
                </div>

                <div className="bg-muted/40 p-4 rounded-lg">
                    <p className="font-semibold">{serviceType?.name ?? "-"}</p>

                    <p className="mt-1 text-muted-foreground text-sm">
                        {serviceType?.description ??
                            "Tidak ada deskripsi layanan."}
                    </p>
                </div>
            </section>

            <Separator />

            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-muted-foreground" />

                    <h3 className="font-semibold text-sm">Kendaraan</h3>
                </div>

                <div className="gap-4 grid grid-cols-2">
                    <DetailItem
                        label="Kendaraan"
                        value={
                            vehicle ? `${vehicle.brand} ${vehicle.model}` : "-"
                        }
                    />

                    <DetailItem
                        label="No. Polisi"
                        value={vehicle?.license_plate ?? "-"}
                    />

                    <DetailItem
                        label="Jenis"
                        value={
                            vehicle?.vehicle_type
                                ? (vehicleTypeLabels[vehicle.vehicle_type] ??
                                  vehicle.vehicle_type)
                                : "-"
                        }
                    />

                    <DetailItem label="Tahun" value={vehicle?.year ?? "-"} />
                </div>
            </section>

            <Separator />

            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />

                    <h3 className="font-semibold text-sm">Pembayaran</h3>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                            Total layanan
                        </span>

                        <span className="font-medium">
                            {formatCurrency(booking.service_price)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">DP</span>

                        <span className="font-medium">
                            {formatCurrency(booking.dp_amount)}
                        </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">
                            Sisa pembayaran
                        </span>

                        <span className="font-semibold">
                            {formatCurrency(booking.remaining_amount)}
                        </span>
                    </div>
                </div>
            </section>

            {booking.notes && (
                <>
                    <Separator />

                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />

                            <h3 className="font-semibold text-sm">Catatan</h3>
                        </div>

                        <div className="bg-muted/40 p-4 rounded-lg text-sm">
                            {booking.notes}
                        </div>
                    </section>
                </>
            )}

            <WorkOrderActions booking={booking} />
        </div>
    );
}
