import { TBookingRequest, TCustomerBooking, TVehicle } from "@/types/types";

export interface SummaryItem {
    status: string;
    total: number;
}

export interface CustomerDashboardProps {
    overview: {
        total_bookings: number;
        active_bookings: number;
        completed_bookings: number;
        total_vehicles: number;
        waiting_requests: number;
        processing_requests: number;
        dp_paid_total: number;
        remaining_revenue_open: number;
    };
    todaySummary: {
        date: string;
        bookings_count: number;
        confirmed_count: number;
        in_progress_count: number;
        completed_count: number;
        pending_payment_count: number;
        waiting_requests_count: number;
    };
    statusSummary: SummaryItem[];
    requestSummary: SummaryItem[];
    nextBooking: TCustomerBooking | null;
    todayBookings: TCustomerBooking[];
    upcomingBookings: TCustomerBooking[];
    recentBookings: TCustomerBooking[];
    waitingRequests: TBookingRequest[];
    vehicles: Array<TVehicle & { bookings_count: number }>;
}
