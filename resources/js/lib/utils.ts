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

/**
 * Parse datetime string as local time (strip Z/UTC offset).
 * Backend stores WIB, but Carbon may append Z. JavaScript would
 * interpret Z as UTC and shift the time. Stripping Z makes JS
 * treat the string as local time = same as what user input.
 */
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
