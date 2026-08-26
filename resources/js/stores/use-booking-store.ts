import { create } from "zustand";

import { TBooking } from "@/types/types";

type Props = {
    selectedData: TBooking | null;
    setSelectedData: (shop: TBooking | null) => void;
    deleteSelectedData: () => void;
};

export const useBookingStore = create<Props>((set) => ({
    selectedData: null,
    setSelectedData: (shop) => set({ selectedData: shop }),
    deleteSelectedData: () => set({ selectedData: null }),
}));
