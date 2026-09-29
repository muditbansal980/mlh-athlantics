import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserData = {
    Id: string,
    Username: string,
    Role: string
}

type UserStore = {
    hydrated: boolean;
    currentUser: UserData | null
    setcurrentUser: (User: UserData | null) => void
    setHydrated: (value: boolean) => void;
}
export const useUserData = create<UserStore>()(
    persist(
        (set) => ({
            currentUser: null,
            hydrated: false,
            setcurrentUser: (User: UserData | null) => set({ currentUser: User }),
            setHydrated: (value) =>
                set({ hydrated: value }),
        }),
        {
            name: "user-data",
             onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            },
        }
    ),
)