import { create } from "zustand";

import { TMechanic } from "@/types/types";

type Props = {
    selectedData: TMechanic | null;
    setSelectedData: (shop: TMechanic | null) => void;
    deleteSelectedData: () => void;
};

export const useMechanicStore = create<Props>((set) => ({
    selectedData: null,
    setSelectedData: (shop) => set({ selectedData: shop }),
    deleteSelectedData: () => set({ selectedData: null }),
}));
