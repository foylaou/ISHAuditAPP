'use client';

import React, {useState} from "react";
import {Button} from "@mantine/core";
import {useGlobalStore} from "@/store/useGlobalStore";
import {useRouter} from "next/navigation";
import axios from "axios";
import {KeyRound, User} from "lucide-react";

interface UserLoginData {
    email: string;
    password: string;
}

export const LoginForm = () => {
    const [_users, setUsers] = useState<UserLoginData[]>([]);
    const [formData, setFormData] = useState<UserLoginData>({email: "", password: ""});
    const [isLoading, setIsLoading] = useState(false);
    const {login} = useGlobalStore();
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            console.log("Submitting:", formData);

            const response = await axios.post("/api/auth", formData);

            if (response) {

                console.log("登入成功");
                setIsLoading(false);
                setUsers(response.data.username);
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
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
            <div className="card w-full max-w-sm bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-2xl font-bold text-center mb-6 items-center text-base-content">系統登入</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                      <div className="relative">
                        <input
                            id="email"
                            type="email"
                            placeholder="請輸入信箱"
                            name="email"
                            value={formData.email}
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
