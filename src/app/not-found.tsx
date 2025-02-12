import React from 'react';

import Link from "next/link";
import { HomeIcon } from "lucide-react";
import FloatingImage from "@/components/Image/FloatingImage";

const Custom404 = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div
        className="max-w-2xl w-full text-center space-y-8 animate-fade-in-up"
      >
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">找不到頁面</h2>
          <p className="text-gray-600">抱歉，您訪問的頁面似乎已經離家出走了...</p>
        </div>

        <div className="relative w-full h-64 sm:h-96">
        <FloatingImage
            src="/404R3.svg"
            alt="404 - 找不到頁面"

          />
        </div>
        <Link
            rel="preload"
          href="/"
            as={'Home'}
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 gap-2"
        >
          <HomeIcon className="w-5 h-5" />
          回到首頁
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
