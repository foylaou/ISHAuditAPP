"use client"
import React from 'react';
import { useGlobalStore } from "@/store/useGlobalStore";
import LoginForm from "@/components/Test/Loginform";

export default function LoginPage() {
    const { theme } = useGlobalStore();

    return (
        <div className={`min-h-screen flex items-center justify-center bg-gray-100 ${theme ? 'dark:bg-gray-900' : ''}`}>
            <div className="w-full max-w-md ">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-base-content">
                        安全稽核系統
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        請登入以繼續操作
                    </p>
                </div>

                <LoginForm redirectUrl="/dashboard" />

                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>© 2025 安全稽核系統. 保留所有權利.</p>
                </div>
            </div>
        </div>
    );
}