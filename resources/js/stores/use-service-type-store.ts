import { create } from "zustand";

import { TServiceType } from "@/types/types";

type Props = {
    selectedData: TServiceType | null;
    setSelectedData: (shop: TServiceType | null) => void;
    deleteSelectedData: () => void;
};

export const useServiceTypeStore = create<Props>((set) => ({
    selectedData: null,
    setSelectedData: (shop) => set({ selectedData: shop }),
    deleteSelectedData: () => set({ selectedData: null }),
}));
