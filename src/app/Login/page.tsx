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
      login({
        sys: 'admin',
        org: 'manager',
        audit: 'user'
      });
      router.push('/');
    } else if (username === 'manager' && password === 'manager123') {
      login({
        sys: 'none',
        org: 'manager',
        audit: 'user'
      });
      router.push('/');
    } else if (username === 'user' && password === 'user123') {
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
    <div className="min-h-screen hero bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-base-content">登入系統</h1>
          <p className="py-6 text-base-content">請輸入您的帳號密碼</p>
        </div>
        <div className="card w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">帳號</span>
              </label>
              <input
                type="text"
                placeholder="請輸入帳號"
                className="input input-bordered text-base-content"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="on"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">密碼</span>
              </label>
              <input
                type="password"
                placeholder="請輸入密碼"
                className="input input-bordered text-base-content"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="on"
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">登入</button>
            </div>
          </form>
        </div>

        <div className="card bg-base-100 shadow-xl mt-4">
          <div className="card-body">
            <h2 className="card-title text-base-content">測試帳號</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr className="text-base-content">
                    <th>權限</th>
                    <th>帳號</th>
                    <th>密碼</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-base-content">
                    <td>管理員</td>
                    <td>admin</td>
                    <td>admin123</td>
                  </tr>
                  <tr className="text-base-content">
                    <td>經理</td>
                    <td>manager</td>
                    <td>manager123</td>
                  </tr>
                  <tr className="text-base-content">
                    <td>使用者</td>
                    <td>user</td>
                    <td>user123</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
