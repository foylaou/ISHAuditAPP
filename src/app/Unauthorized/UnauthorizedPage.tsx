'use client';
import Link from 'next/link';
import { Shield, Home, AlertCircle } from 'lucide-react';
import {useEffect, useState} from "react";

const UnauthorizedPage = () => {
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const roles = localStorage.getItem("userRoles");
    if (roles) {
      setUserRoles(JSON.parse(roles));
    }
  }, []);
  return (
    <div className="min-h-screen hero bg-base-200">
      <div className="hero-content text-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Icon Section */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Shield className="w-20 h-20 text-error animate-pulse" />
                <AlertCircle className="w-8 h-8 text-error absolute -bottom-1 -right-1" />
              </div>
            </div>

            {/* Content Section */}
            <h1 className="text-5xl font-bold text-error">403</h1>
            <h2 className="text-2xl font-bold text-base-content">
              存取被拒絕
            </h2>

            <p className="text-base-content/70">
              抱歉，您沒有權限訪問此頁面。請確認您的權限或聯繫系統管理員。
            </p>

            {/* Button Section */}
            <div className="card-actions justify-center mt-4">
              <Link href="/" className="btn btn-primary">
                <Home className="w-5 h-5 mr-2" />
                返回首頁
              </Link>
            </div>

            {/* Footer Section */}
            <div className="divider"></div>
            <p className="text-sm text-base-content/60">
              如需協助，請聯繫系統管理員
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UnauthorizedPage;
