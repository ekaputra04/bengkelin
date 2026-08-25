import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
}

export function parseLocalDateTime(value: string): Date {
    return new Date(value.replace(/Z$/i, "").replace(/\+\d{2}:\d{2}$/, ""));
}

export function formatDateTime(date: string | Date): string {
    const d = typeof date === "string" ? parseLocalDateTime(date) : date;

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
        .format(d)
        .replace(/\./g, ".");
}

export function formatLocalDate(date?: Date): string {
    const d = date ?? new Date();

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDuration(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const minutes = Math.round(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60),
    );

    if (minutes < 60) {
        return `${minutes} menit`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
        return `${hours} jam`;
    }

    return `${hours} jam ${remainingMinutes} menit`;
}
