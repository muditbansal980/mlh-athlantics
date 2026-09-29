import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
    Id: number;
    ItemId: number;
    Name: string;
    Price: number;
    Quantity: number;
    Status: string;
    ImageUrl: string;
    
}

type CartStore = {
    StoredCartItems: CartItem[];
    setStoredCartItems: (items: CartItem[]) => void;
    hasHydrated: boolean          // ← add this
    setHasHydrated: (v: boolean) => void
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            StoredCartItems: [],
            setStoredCartItems: (items: CartItem[]) => set({ StoredCartItems: items }),
            hasHydrated: false,
            setHasHydrated: (v) => set({ hasHydrated: v }),
        }),
        {
            name: "cart-data",
            onRehydrateStorage: () => (state) => {
                // fires AFTER localStorage data is loaded into store
                state?.setHasHydrated(true)
            }
            
        })
)