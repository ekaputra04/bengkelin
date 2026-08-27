import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { TUserRole } from '@/types/types';

export const APP_TIME_ZONE = "Asia/Makassar";

const APP_TIME_ZONE_OFFSET_HOURS = 8;
const DATE_TIME_WITH_TIMEZONE_PATTERN = /(Z|[+-]\d{2}:\d{2})$/i;
const DATE_TIME_PARTS_PATTERN =
    /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/;

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

function normalizeDateTimeValue(value: string): string {
    return value.trim().replace(" ", "T");
}

function createAppDate(value: string): Date {
    const normalized = normalizeDateTimeValue(value);

    if (DATE_TIME_WITH_TIMEZONE_PATTERN.test(normalized)) {
        return new Date(normalized);
    }

    const match = normalized.match(DATE_TIME_PARTS_PATTERN);

    if (!match) {
        return new Date(normalized);
    }

    const [, year, month, day, hour = "00", minute = "00", second = "00", millisecond = "0"] = match;

    return new Date(
        Date.UTC(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hour) - APP_TIME_ZONE_OFFSET_HOURS,
            Number(minute),
            Number(second),
            Number(millisecond.padEnd(3, "0")),
        ),
    );
}

function getDateFormatter(
    options: Intl.DateTimeFormatOptions,
    locale = "id-ID",
) {
    return new Intl.DateTimeFormat(locale, {
        ...options,
        timeZone: APP_TIME_ZONE,
    });
}

export function parseLocalDateTime(value: string): Date {
    return createAppDate(value);
}

export function getTimeInMinutes(date: string | Date): number {
    const value = typeof date === "string" ? createAppDate(date) : date;
    const parts = getDateFormatter(
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        },
        "en-GB",
    ).formatToParts(value);

    const hours = Number(
        parts.find((part) => part.type === "hour")?.value ?? "0",
    );
    const minutes = Number(
        parts.find((part) => part.type === "minute")?.value ?? "0",
    );

    return hours * 60 + minutes;
}

export function formatDateTime(date: string | Date): string {
    const d = typeof date === "string" ? createAppDate(date) : date;

    return getDateFormatter({
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

export function formatDate(date: string | Date): string {
    const value = typeof date === "string" ? createAppDate(date) : date;

    return getDateFormatter({
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(value);
}

export function formatTime(date: string) {
    return getDateFormatter({
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(createAppDate(date));
}

export function formatTimeFieldValue(date: string | Date): string {
    const value = typeof date === "string" ? createAppDate(date) : date;
    const parts = getDateFormatter(
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        },
        "en-GB",
    ).formatToParts(value);

    const hours = parts.find((part) => part.type === "hour")?.value ?? "00";
    const minutes =
        parts.find((part) => part.type === "minute")?.value ?? "00";

    return `${hours}:${minutes}`;
}

export function formatLocalDate(date?: Date): string {
    const d = date ?? new Date();

    const parts = getDateFormatter(
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        },
        "en-CA",
    ).formatToParts(d);

    const year = parts.find((part) => part.type === "year")?.value ?? "0000";
    const month =
        parts.find((part) => part.type === "month")?.value ?? "01";
    const day = parts.find((part) => part.type === "day")?.value ?? "01";

    return `${year}-${month}-${day}`;
}

export function formatDuration(start: string, end: string): string {
    const startDate = createAppDate(start);
    const endDate = createAppDate(end);

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

export function getDashboardRoute(role: TUserRole) {
    switch (role) {
        case "admin":
            return "admin.dashboard";

        case "customer":
            return "customer.dashboard";

        default:
            throw new Error(`Unsupported user role: ${role}`);
    }
}
