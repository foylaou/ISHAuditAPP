"use client";
import React from 'react';
import Link from 'next/link';
import useWindowSize from "@/components/Tools/useWindowSize";
import FloatingImage from "@/components/Image/FloatingImage";

interface UnsupportedDeviceProps {
  minWidth?: number; // 最小支援寬度
  redirectUrl?: string; // 回首頁的連結
}

export default function UnsupportedDevicePage({
minWidth = 800,
redirectUrl = '/'
}: UnsupportedDeviceProps) {
const size = useWindowSize();



  return (
    <div className="fixed inset-0 bg-base-100 flex flex-col items-center justify-center p-4 z-50">
      <div className="bg-base-200 rounded-lg shadow-lg max-w-md w-full p-6 text-center">
        <div className="mb-6">
        <FloatingImage
          src="/500R3.svg"
          alt=""/>
        </div>

        <h1 className="text-2xl font-bold text-error mb-2">裝置不支援</h1>

        <p className="text-base-content mb-6">
          此頁面不支援您的裝置，請使用解析度 {minWidth}px 以上的裝置再進行操作。
        </p>

        <Link
          href={redirectUrl}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          回首頁
        </Link>
      </div>

      <div className="mt-4 text-sm text-neutral-content">
        目前裝置寬度: {size.width}px
      </div>
    </div>
  );
};
