export type TBookingRequestStatus =
    | "waiting"
    | "processing"
    | "converted"
    | "expired"
    | "cancelled";

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
    user?: { id: number; name: string };
    license_plate: string;
    brand: string;
    model: string;
    vehicle_type: "motorcycle" | "car";
    year?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export type TBooking = {
    id: number;
    booking_code: string;
    start_at: string;
    end_at: string;
    dp_amount: string;
    remaining_amount: string;
    status: string;
    paid_at?: string | null;
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
