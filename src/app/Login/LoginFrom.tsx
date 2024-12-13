'use client';

import React, { useState } from "react";
import {Button, Input} from "@mantine/core";
import {useGlobalStore} from "@/store/useGlobalStore";
import {useRouter} from "next/navigation";



interface UserLoginData {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const [_users, setUsers] = useState<UserLoginData[]>([]); // 使用者狀態
  const [formData, setFormData] = useState<UserLoginData>({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useGlobalStore();
   const router = useRouter();

  // 處理輸入變更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 處理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("Submitting:", formData);
      // 模擬提交資料至後端 API
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
         const result = await response.json();
      if (response.ok) {
        console.log("登入成功");
        setIsLoading(false);
        setUsers(result.username);
              login({
        sys: 'admin',
        org: 'manager',
        audit: 'user'
      });
              router.push('/');


      } else {
        console.error("登入失敗");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div className="form-control">
        <label htmlFor="email" className="label">信箱</label>
        <Input
          id="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          type="email"
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control">
        <label htmlFor="password" className="label">密碼</label>
        <Input
          id="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          type="password"
          className="input input-bordered w-full"
        />
      </div>

      <Button
        id="submit"
        type="submit"
        name="submit"
        className="btn btn-primary w-full"
        loading={isLoading} // 使用 loading 屬性
      >
        {isLoading ? "登入中..." : "登入"}
      </Button>
    </form>
  );
};

export default LoginForm;
