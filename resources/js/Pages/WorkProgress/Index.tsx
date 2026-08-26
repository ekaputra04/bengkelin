import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/Components/ui/button";
import WorkProgressTimeline, {
    workProgressBookings,
} from "@/Components/WorkOrders/WorkProgressTimeline";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { TBooking } from "@/types/types";
import { Head, usePage } from "@inertiajs/react";

export default function Index() {
    const props = usePage().props;
    const bookings: TBooking[] = props.bookings as TBooking[];
    const selectedDate = "2026-08-25";

    const formattedDate = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(`${selectedDate}T00:00:00`));

    return (
        <DashboardLayout
            breadcrumbs={[
                {
                    label: "Progres Pekerjaan",
                },
            ]}
        >
            <Head title="Progres Pekerjaan" />

            <div className="space-y-6">
                <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="font-semibold text-2xl tracking-tight">
                            Progres Pekerjaan
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            Pantau jadwal pekerjaan mekanik hari ini.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon">
                            <ChevronLeft />
                        </Button>

                        <Button variant="outline" className="min-w-[220px]">
                            <CalendarDays className="mr-2 w-4 h-4" />

                            {formattedDate}
                        </Button>

                        <Button variant="outline" size="icon">
                            <ChevronRight />
                        </Button>
                    </div>
                </div>

                <WorkProgressTimeline bookings={bookings} date={selectedDate} />
            </div>
        </DashboardLayout>
    );
}
