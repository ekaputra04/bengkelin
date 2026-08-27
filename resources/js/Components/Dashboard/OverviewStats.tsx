import { CreditCard, TimerReset, Users, Wrench } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface Props {
    activeWorkOrders: number;
    waitingRequests: number;
    activeMechanics: number;
    dpCollectedThisMonth: number;
}

export function OverviewStats({
    activeWorkOrders,
    waitingRequests,
    activeMechanics,
    dpCollectedThisMonth,
}: Props) {
    const statCards = [
        {
            label: "Order Aktif",
            value: activeWorkOrders,
            hint: "Sedang dikerjakan mekanik",
            icon: Wrench,
            tone: "from-emerald-500/15 to-emerald-500/5",
        },
        {
            label: "Antrean Request",
            value: waitingRequests,
            hint: "Masih menunggu slot aman",
            icon: TimerReset,
            tone: "from-amber-500/15 to-amber-500/5",
        },
        {
            label: "Mekanik Aktif",
            value: activeMechanics,
            hint: "Siap menerima pekerjaan",
            icon: Users,
            tone: "from-sky-500/15 to-sky-500/5",
        },
        {
            label: "DP Bulan Ini",
            value: formatCurrency(dpCollectedThisMonth),
            hint: "Masuk pada Agustus 2026",
            icon: CreditCard,
            tone: "from-fuchsia-500/15 to-fuchsia-500/5",
        },
    ];

    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((item) => {
                const Icon = item.icon;

                return (
                    <Card
                        key={item.label}
                        className={`border-0 bg-gradient-to-br ${item.tone} shadow-sm ring-1 ring-black/5`}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardDescription>{item.label}</CardDescription>
                                <div className="rounded-2xl bg-white/75 p-2 shadow-sm">
                                    <Icon className="w-4 h-4 text-slate-700" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl tracking-tight">
                                {item.value}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {item.hint}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </section>
    );
}
