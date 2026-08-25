export type TBookingRequestStatus =
    | "waiting"
    | "processing"
    | "converted"
    | "expired"
    | "cancelled";

export type TBookingStatus =
    | "pending_payment"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "expired"
    | "no_show";

export type TVehicleType = "motorcycle" | "car";

export type TServiceType = {
    id?: number;
    name: string;
    description: string;
    duration_minutes: number;
    price: number;
    dp_amount: number;
    is_active: boolean;
    created_at?: string | null;
    updated_at?: string | null;
};

export type TUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at?: string | null;
    updated_at?: string | null;
};

export type TVehicle = {
    id: number;
    user?: TUser;
    license_plate: string;
    brand: string;
    model: string;
    vehicle_type?: TVehicleType;
    year?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
    bookings?: TBooking[];
};

export type TBooking = {
    id: number;
    booking_code: string;
    booking_request_id: number;
    user_id: number;
    vehicle_id: number;
    service_type_id: number;
    mechanic_user_id: number;
    start_at: string;
    end_at: string;
    service_price: number;
    dp_amount: number;
    remaining_amount: number;
    status: TBookingStatus;
    confirmed_at?: string | null;
    completed_at?: string | null;
    cancelled_at?: string | null;
    no_show_at?: string | null;
    paid_at?: string | null;
    notes?: string | null;
    service_type?: TServiceType;
    mechanic?: TUser;
    vehicle?: TVehicle;
};

export type TWorkOrder = TBooking & {
    user: { id: number; name: string };
    vehicle: TVehicle;
    service_type: TServiceType;
    mechanic: { id: number; name: string };
    payment?: { id: number; status: string } | null;
};

export type TCustomerBooking = TBooking & {
    vehicle: TVehicle;
    service_type: TServiceType;
    mechanic?: { id: number; name: string } | null;
    payment?: { id: number; status: string } | null;
};

export type TBookingRequest = {
    id: number;
    requested_start_at: string;
    requested_end_at?: string | null;
    status: TBookingRequestStatus;
    failure_reason?: string | null;
    vehicle: TVehicle;
    service_type: TServiceType;
    booking?: TBooking | null;
    user?: TUser | null;
};
