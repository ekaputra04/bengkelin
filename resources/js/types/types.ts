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

export type TMechanic = {
    id?: number;
    name: string;
    phone: string;
    is_active: boolean;
    created_at?: string | null;
    updated_at?: string | null;
};

export type TVehicle = {
    id: number;
    license_plate: string;
    brand: string;
    model: string;
    vehicle_type: "motorcycle" | "car";
    year?: number | null;
};

export type TBooking = {
    id: number;
    booking_code: string;
    start_at: string;
    end_at: string;
    dp_amount: string;
    remaining_amount: string;
    status: string;
};

export type TWorkOrder = TBooking & {
    user: { id: number; name: string };
    vehicle: TVehicle;
    service_type: TServiceType;
    mechanic: { id: number; name: string };
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
    status: string;
    failure_reason?: string | null;
    vehicle: TVehicle;
    service_type: TServiceType;
    booking?: TBooking | null;
};
