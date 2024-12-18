'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, User } from "lucide-react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { authService } from "@/services/authService";

interface UserLoginData {
    username: string;
    password: string;
}

export const LoginForm = () => {
    const [formData, setFormData] = useState<UserLoginData>({username: "", password: ""});
    const [isLoading, setIsLoading] = useState(false);
    const [_error, setError] = useState<string>("");
    const { login } = useGlobalStore();
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { roles, userName, message } = await authService.login(formData);

            // 使用返回的 roles 更新全局狀態
            login(roles);

            console.log(message); // "登入成功"
            router.push('/',);
        } catch (error) {
            console.error("登入失敗:", error);
            setError("登入失敗，請檢查帳號密碼是否正確");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
            <div className="card w-full max-w-sm bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-2xl font-bold text-center mb-6 items-center text-base-content">系統登入</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                      <div className="relative">
                        <input
                            id="username"
                            type="text"
                            placeholder="請輸入帳號"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="input input-bordered w-full pl-10 text-neutral"
                            required
                        />
                        <User
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 w-5 h-5"/>
                      </div>
                    </div>

                    <div className="form-control">
                      <div className="relative">
                        <input
                            id="password"
                            type="password"
                            placeholder="請輸入密碼"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="input input-bordered w-full pl-10 text-neutral"
                            required
                        />
                        <KeyRound
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 w-5 h-5"/>
                      </div>
                    </div>

                    <div className="form-control mt-6">
                      <button
                          id="submit"
                          type="submit"
                          className="btn btn-primary w-full"
                          disabled={isLoading}
                      >
                        {isLoading && <span className="loading loading-spinner"/>}
                        {isLoading ? "登入中..." : "登入"}
                      </button>
                    </div>
                  </form>

                  <div className="divider mt-6  text-base-content">大型石化督導資料庫</div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
