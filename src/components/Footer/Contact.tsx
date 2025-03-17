"use client"

import {ChangeEvent, FormEvent, useState} from "react";

interface FormData {
  name: string;
  email: string;
  organization: string;
  subject: string;
  message: string;
  category: string;
}

interface SubmitStatus {
  type: 'success' | 'error'| null;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    type: null,
    message: '',
  });

  // 修正 handleInputChange 函數的型別
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value
    }));
  };

  // 修正 handleSubmit 函數的型別
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 在這裡實現表單提交邏輯
      // 例如使用 API 路由發送表單數據
      const response: Response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: '您的訊息已成功送出，我們將盡快回覆您。'
        });
        // 清空表單
        setFormData({
          name: '',
          email: '',
          organization: '',
          subject: '',
          message: '',
          category: 'general'
        });
      } else {
        const errorData: { message?: string } = await response.json();
        throw new Error(errorData.message || '提交失敗，請稍後再試。');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : '提交失敗，請稍後再試。'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-base-content">
      <h1 className="text-3xl font-bold mb-6 text-base-content">聯絡我們</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* 聯絡資訊 */}
        <div className="md:col-span-4">
          <div className="bg-base-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-base-content">聯絡資訊</h2>

            <div className="mb-6">
              <h3 className="text-base font-medium mb-1 text-base-content">系統管理單位</h3>
              <p className="text-base-content">[單位名稱]</p>
            </div>

            <div className="mb-6">
              <h3 className="text-base font-medium mb-1 text-base-content">聯絡電話</h3>
              <p className="text-base-content">(02) XXXX-XXXX</p>
              <p className="text-base-content">服務時間：週一至週五 9:00-17:00</p>
            </div>

            <div className="mb-6">
              <h3 className="text-base font-medium mb-1 text-base-content">電子郵件</h3>
              <p className="text-base-content">support@petrochemicalsystem.gov.tw</p>
            </div>

            <div>
              <h3 className="text-base font-medium mb-1 text-base-content">地址</h3>
              <p className="text-base-content">[地址資訊]</p>
            </div>
          </div>

          <div className="bg-base-200 p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-semibold mb-4 text-base-content">常見問題</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-medium text-base-content">忘記密碼怎麼辦？</h3>
                <p className="text-sm text-base-content">請使用登入頁面的「忘記密碼」功能重設密碼。</p>
              </div>
              <div>
                <h3 className="text-base font-medium text-base-content">如何申請系統帳號？</h3>
                <p className="text-sm text-base-content">請聯繫您單位的系統管理員申請帳號。</p>
              </div>
              <div>
                <h3 className="text-base font-medium text-base-content">遇到技術問題如何處理？</h3>
                <p className="text-sm text-base-content">請使用下方聯絡表單，選擇「技術支援」類別提交您的問題。</p>
              </div>
            </div>
          </div>
        </div>

        {/* 聯絡表單 */}
        <div className="md:col-span-8">
          <div className="bg-base-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-base-content">聯絡表單</h2>

            {submitStatus.type && (
              <div className={`p-4 mb-6 rounded-md ${submitStatus.type === 'success' ? 'bg-success/10 text-success-content' : 'bg-error/10 text-error-content'}`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-base-content mb-1">
                  姓名 *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-base-content mb-1">
                  電子郵件 *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="organization" className="block text-sm font-medium text-base-content mb-1">
                  單位/組織 *
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-base-content mb-1">
                  問題類別 *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="general">一般詢問</option>
                  <option value="technical">技術支援</option>
                  <option value="account">帳號問題</option>
                  <option value="report">報告相關</option>
                  <option value="tracking">問題追蹤相關</option>
                  <option value="suggestion">建議與回饋</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-base-content mb-1">
                  主旨 *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-base-content mb-1">
                  訊息內容 *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary hover:bg-primary-hover text-primary-content rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                >
                  {isSubmitting ? '提交中...' : '提交訊息'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
