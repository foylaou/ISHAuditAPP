import { UserRoles } from "@/types/authType";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserInfo {
  Username: string;
  setUsername: (username: string) => void;
  Email: string;
  setEmail: (email: string) => void;
  roles: UserRoles;
  setRoles: (roles: UserRoles) => void;
}

export const userInfoStore = create<UserInfo>()(
  persist(
    (set) => ({
      Username: "",
      setUsername: (username) => set({ Username: username }),
      Email: "",
      setEmail: (email) => set({ Email: email }),
      roles: {} as UserRoles,
      setRoles: (roles) => set({ roles: roles }),
    }),
    {
      name: "user-info-storage",
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : {
          getItem: (_name: string) => null,
          setItem: (_name: string, _value: string) => {},
          removeItem: (_name: string) => {}
        }
      ),
    }
  )
);
