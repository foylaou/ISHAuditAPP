"use client";

import { useEffect } from "react";
import Link from "next/link";
import { HomeIcon } from "lucide-react";
import FloatingImage from "@/components/Image/FloatingImage";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in-up">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">500</h1>
          <h2 className="text-2xl font-semibold text-gray-700">伺服器錯誤</h2>
          <p className="text-gray-600">抱歉，伺服器發生了一些問題...</p>
          <button
            onClick={reset}
            className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            重試
          </button>
        </div>

        <div className="relative w-full h-64 sm:h-96">
                  <FloatingImage
            src="/500R3.svg"
            alt="500 伺服器錯誤"
          />
        </div>

        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 gap-2"
        >
          <HomeIcon className="w-5 h-5" />
          回到首頁
        </Link>
      </div>
    </div>
  );
}
