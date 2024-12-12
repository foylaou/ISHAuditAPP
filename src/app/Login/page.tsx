'use client'
import { useState } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useGlobalStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 模擬登入驗證
    if (username === 'admin' && password === 'admin123') {
      // 設置管理員權限
      login({
        sys: 'admin',
        org: 'manager',
        audit: 'user'
      });
      router.push('/'); // 導向首頁
    } else if (username === 'manager' && password === 'manager123') {
      // 設置經理權限
      login({
        sys: 'none',
        org: 'manager',
        audit: 'user'
      });
      router.push('/');
    } else if (username === 'user' && password === 'user123') {
      // 設置一般用戶權限
      login({
        sys: 'none',
        org: 'none',
        audit: 'user'
      });
      router.push('/');
    } else {
      alert('帳號或密碼錯誤');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9">
          登入系統
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6">
              帳號
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6">
              密碼
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
            >
              登入
            </button>
          </div>
        </form>

        <div className="mt-4 text-sm">
          測試帳號：
          <ul className="list-disc list-inside mt-2">
            <li>管理員：admin / admin123</li>
            <li>經理：manager / manager123</li>
            <li>用戶：user / user123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
