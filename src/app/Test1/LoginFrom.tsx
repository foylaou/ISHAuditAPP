'use client';

import { useEffect, useState } from "react";
import Input from "@/components/daisyui/Input/Input";



// 定義介面
interface UserLoginData {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const [users, setUsers] = useState<UserLoginData[]>([]); // 初始值設為空陣列


  useEffect(() => {
    // 定義一個異步函式
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/auth"); // 請求 API
        const data: UserLoginData[] = await response.json(); // 確保資料符合 UserLoginData[] 型別
        setUsers(data); // 設置狀態
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers(); // 執行異步函式
  }, []); // 空的依賴陣列，確保只在組件掛載時執行一次

   return (
       <Input

            ref=
            type=""
            value=""
            placeholder=
            data-theme="dark"
            className="top-0"

       />
  );
};

export default LoginForm;
