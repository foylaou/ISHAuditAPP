'use client'
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">403</h1>
        <p className="mt-4">您沒有權限訪問此頁面</p>
        <Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
          返回首頁
        </Link>
      </div>
    </div>
  );
}
