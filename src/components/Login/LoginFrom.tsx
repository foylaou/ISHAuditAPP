// components/LoginForm.tsx
'use client';

import React, {useState} from "react";
import { useRouter } from "next/navigation";
import { KeyRound, User } from "lucide-react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { authService } from "@/services/authService";
import type { LoginForm } from "@/types/authType";
import {userInfoStore} from "@/store/useUserinfoStore";



export default function LoginForm()  {
  const [formData, setFormData] = useState<LoginForm>({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [_error, setError] = useState<string>("");
  const { login } = useGlobalStore();
  const router = useRouter();
  const {setUsername,setRoles} = userInfoStore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name.toLowerCase()]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError("請填寫帳號和密碼");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { roles, message ,userName } = await authService.login(formData);
      setUsername(userName);
      setRoles(roles);
      login(roles);
      console.log(message);
      router.push('/Home');
    } catch (error) {
        console.error('Error:', error);

    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center pt-32">
      <div className="w-full max-w-sm space-y-6">

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-2xl font-bold justify-center text-base-content">
              系統登入
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="form-control w-full">
                <div className="relative">
                  <input
                      id="username"
                      type="text"
                      placeholder="請輸入帳號"
                      title="請輸入帳號"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="input input-bordered w-full pl-10 text-sm font-bold text-base-content"
                      required
                      disabled={isLoading}
                  />
                  <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 w-5 h-5"
                  />
                </div>
              </div>

              <div className="form-control w-full">
                <div className="relative">
                  <input
                      id="password"
                      type="password"
                      placeholder="請輸入密碼"
                      title="請輸入密碼"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input input-bordered w-full pl-10 text-sm font-bold text-base-content"
                      required
                      disabled={isLoading}
                  />
                  <KeyRound
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 w-5 h-5"
                  />
                </div>
              </div>

              <div className="form-control w-full mt-6">
                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    aria-label="登入"
                    disabled={isLoading}
                >
                  {isLoading && (
                      <span className="loading loading-spinner loading-sm"/>
                  )}
                  {isLoading ? "登入中..." : "登入"}
                </button>
              </div>


            </form>

            <div className="divider text-base-content">大型石化督導資料庫</div>
          </div>
        </div>
      </div>
    </div>
  );
}
