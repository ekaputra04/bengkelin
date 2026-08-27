import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { bookingStatusConfig } from "@/consts/consts";

import { requestStatusClasses, requestStatusLabels } from "./shared";
import { SummaryItem } from "./types";

interface Props {
    statusSummary: SummaryItem[];
    requestSummary: SummaryItem[];
}

export function StatusDistribution({ statusSummary, requestSummary }: Props) {
    return (
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card className="border-0 shadow-sm ring-1 ring-black/5">
                <CardHeader>
                    <CardTitle>Distribusi Status Booking</CardTitle>
                    <CardDescription>
                        Status order yang sedang hidup di sistem.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                    {statusSummary.map((item) => (
                        <div key={item.status} className="flex items-center justify-between rounded-2xl border bg-white/70 px-4 py-3">
                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${bookingStatusConfig[item.status as keyof typeof bookingStatusConfig]?.className ?? "border-slate-200 bg-slate-50 text-slate-700"}`}>
                                {bookingStatusConfig[item.status as keyof typeof bookingStatusConfig]?.label ?? item.status}
                            </span>
                            <span className="font-semibold text-lg">{item.total}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm ring-1 ring-black/5">
                <CardHeader>
                    <CardTitle>Distribusi Request</CardTitle>
                    <CardDescription>
                        Kondisi booking request sebelum menjadi order.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {requestSummary.map((item) => (
                        <div key={item.status} className="flex items-center justify-between rounded-2xl border bg-white/70 px-4 py-3">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs ring-1 ${requestStatusClasses[item.status] ?? "bg-slate-50 text-slate-700 ring-slate-200"}`}>
                                {requestStatusLabels[item.status] ?? item.status}
                            </span>
                            <span className="font-semibold">{item.total}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </section>
    );
}
