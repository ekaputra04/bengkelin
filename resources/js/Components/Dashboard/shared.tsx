import { CalendarClock } from "lucide-react";

export const requestStatusLabels: Record<string, string> = {
    waiting: "Menunggu Slot",
    processing: "Menunggu Pembayaran",
    converted: "Berhasil Jadi Order",
    expired: "Kedaluwarsa",
    cancelled: "Dibatalkan",
};

export const requestStatusClasses: Record<string, string> = {
    waiting: "bg-amber-50 text-amber-700 ring-amber-200",
    processing: "bg-sky-50 text-sky-700 ring-sky-200",
    converted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    expired: "bg-orange-50 text-orange-700 ring-orange-200",
    cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function MiniStat({
    label,
    value,
    accent,
}: {
    label: string;
    value: number;
    accent: string;
}) {
    return (
        <div className="rounded-2xl border bg-white/70 p-4">
            <div className="flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${accent}`} />
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
            <p className="mt-3 font-semibold text-3xl tracking-tight">{value}</p>
        </div>
    );
}

export function StatRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}) {
    return (
        <div className="flex items-center justify-between rounded-2xl border bg-white/70 px-4 py-3">
            <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                    {icon}
                </div>
                <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <span className="font-semibold">{value}</span>
        </div>
    );
}

export function EmptyState({ text }: { text: string }) {
    return (
        <div className="rounded-2xl border border-dashed bg-slate-50/80 px-4 py-8 text-center text-sm text-muted-foreground">
            <CalendarClock className="mx-auto mb-2 w-5 h-5 opacity-60" />
            {text}
        </div>
    );
}
