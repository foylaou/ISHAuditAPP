import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserInfo {
  Username: string;
  setUsername: (username: string) => void; // 🔹修正 setUserName -> setUsername
  Email: string;
  setEmail: (email: string) => void;
}

export const userInfoStore = create<UserInfo>()(
  persist(
    (set) => ({
      Username: "",
      setUsername: (username) => {
        set({ Username: username }); // 🔹修正 `name` 變數錯誤
      },
      Email: "",
      setEmail: (email) => {
        set({ Email: email });
      },
    }),
    {
      name: "user-info-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : {
          getItem: (_name: string) => null,
          setItem: (_name: string, _value: string) => {},
          removeItem: (_name: string) => {},
        }
      ),
    }
  )
);
