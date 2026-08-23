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
