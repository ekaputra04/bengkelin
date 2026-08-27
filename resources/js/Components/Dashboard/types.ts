export interface SummaryItem {
    status: string;
    total: number;
}

export interface BookingItem {
    id: number;
    booking_code: string;
    start_at: string;
    end_at: string;
    status: string;
    remaining_amount: number;
    user: { name: string };
    vehicle: { license_plate: string; brand: string; model: string };
    service_type: { name: string };
    mechanic: { name: string } | null;
    payment?: { status: string } | null;
}

export interface WaitingRequestItem {
    id: number;
    requested_start_at: string;
    failure_reason?: string | null;
    user: { name: string };
    vehicle: { license_plate: string; brand: string; model: string };
    service_type: { name: string; duration_minutes: number };
}

export interface MechanicLoadItem {
    id: number;
    name: string;
    today_jobs_count: number;
    in_progress_jobs_count: number;
    waiting_assignments_count: number;
    next_booking: {
        start_at: string;
        vehicle: string | null;
        service_name: string | null;
    } | null;
}

export interface DashboardProps {
    overview: {
        total_bookings: number;
        active_work_orders: number;
        waiting_requests: number;
        active_mechanics: number;
        total_customers: number;
        total_vehicles: number;
        dp_collected_this_month: number;
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
    todayBookings: BookingItem[];
    upcomingBookings: BookingItem[];
    waitingRequests: WaitingRequestItem[];
    mechanicLoad: MechanicLoadItem[];
}
