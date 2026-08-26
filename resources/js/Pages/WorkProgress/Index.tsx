import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import WorkProgressTimeline from "@/Components/WorkOrders/WorkProgressTimeline";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { TMechanicWorkProgress } from "@/types/types";
import { Head, router } from "@inertiajs/react";

interface Props {
    mechanics: TMechanicWorkProgress[];
    selectedDate: string;
}

export default function Index({ mechanics, selectedDate }: Props) {
    const formattedDate = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(`${selectedDate}T00:00:00`));

    const changeDate = (date: string) => {
        if (!date || date === selectedDate) {
            return;
        }

        router.get(
            route("admin.work-progress.index"),
            {
                date,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const changeDay = (days: number) => {
        const date = new Date(`${selectedDate}T00:00:00`);

        date.setDate(date.getDate() + days);

        const nextDate = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
        ].join("-");

        changeDate(nextDate);
    };

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
                            Pantau jadwal pekerjaan mekanik.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => changeDay(-1)}
                    >
                        <ChevronLeft />
                    </Button>

                    <div className="relative">
                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(event) => changeDate(event.target.value)}
                        />
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => changeDay(1)}
                    >
                        <ChevronRight />
                    </Button>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />

                    <span className="font-medium">{formattedDate}</span>
                </div>

                <WorkProgressTimeline
                    mechanics={mechanics}
                    selectedDate={selectedDate}
                />
            </div>
        </DashboardLayout>
    );
}
