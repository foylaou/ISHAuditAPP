//components/Register/RegisterForm.tsx
'use client';
import React, { useState } from 'react';
import { enterpriseService } from '@/services/enterpriseService';
import { RegisterForm } from "@/types/registerType";
import { useEnterprises } from '@/hooks/selector/useEnterprises';
import {registerServices} from "@/services/registerServices";
import {EnterpriseSelector} from "@/components/Selector/EnterpriseSelector";




export default function SignupPage() {
  const { enterprises, loading, refresh } = useEnterprises();
  const [formData, setFormData] = useState<RegisterForm>({
    username: '',
    password: '',
    name: '',
    enterpriseId: '',
    companyId: '',
    factoryId: '',
    auditRole: 'None',
    kpiRole: 'None',
    sysRole: 'None',
    orgRole: 'None'
  });



  const companies = formData.enterpriseId
    ? enterpriseService.getCompaniesByEnterpriseId(enterprises, formData.enterpriseId)
    : [];

  const factories = formData.companyId
    ? enterpriseService.getFactoriesByCompanyId(enterprises, formData.companyId)
    : [];

  interface ValidationError {
    field: string;
    message: string;
  }

  const validateForm = (): boolean => {
    const errors: ValidationError[] = [];

    if (!formData.username) errors.push({ field: 'username', message: '請填寫使用者名稱' });
    if (!formData.password) errors.push({ field: 'password', message: '請填寫密碼' });
    if (!formData.name) errors.push({ field: 'name', message: '請填寫名字' });
    if (!formData.enterpriseId) errors.push({ field: 'enterpriseId', message: '請選擇企業' });
    if (!formData.companyId) errors.push({ field: 'companyId', message: '請選擇公司' });
    if (!formData.factoryId) errors.push({ field: 'factoryId', message: '請選擇工廠' });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (formData.password && !passwordRegex.test(formData.password)) {
      errors.push({ field: 'password', message: '密碼必須包含至少8個字符，包括大小寫字母和數字' });
    }

    if (errors.length > 0) {
      alert(errors.map(error => error.message).join('\n'));
      return false;
    }

    return true;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  try {
    const { message } = await registerServices.register(formData);
    alert('註冊成功！');
    window.location.href = '/login';
  } catch (error) {
    interface ApiError {
      response?: {
        data?: {
          message?: string;
        };
      };
    }

    const apiError = error as ApiError;
    const errorMessage = apiError.response?.data?.message || '註冊失敗，請檢查輸入資料';
    alert(errorMessage);
    console.error('註冊失敗:', error);
  }
};

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'enterpriseId') {
        newData.companyId = '';
        newData.factoryId = '';
      } else if (name === 'companyId') {
        newData.factoryId = '';
      }
      return newData;
    });
  };

  // 使用 Hook 提供的 refresh 函數
  const handleRefresh = () => {
    refresh();
  };

  if (loading) {
    return <div className="loading loading-spinner loading-lg"></div>;
  }

  return (

    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl w-full max-w-2xl">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title text-2xl font-bold text-base-content">建立人員帳號</h2>
            <button
              onClick={handleRefresh}
              className="btn btn-outline btn-sm"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : '刷新企業資料'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">帳號</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">密碼</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">名字</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>

            {/* EnterPrise Selection */}

            <EnterpriseSelector
                formData={formData}
                onChange={handleInputChange}
            />


            {/* Permissions */}
          <div className="divider"></div>
          <div className="space-y-6">
            {/* Audit權限 */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Audit權限</span>
              </label>
              <div className="flex gap-6 items-center">
                {['Admin', 'Power', 'Operator', 'None'].map((role) => (
                  <label key={`audit-${role}`} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="auditRole"
                      value={role}
                      checked={formData.auditRole === role}
                      onChange={handleInputChange}
                      className="radio radio-primary"
                    />
                    <span className="label-text">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* KPI權限 */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">KPI權限</span>
              </label>
              <div className="flex gap-6 items-center">
                {['Admin', 'Power', 'Operator', 'None'].map((role) => (
                  <label key={`kpi-${role}`} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="kpiRole"
                      value={role}
                      checked={formData.kpiRole === role}
                      onChange={handleInputChange}
                      className="radio radio-primary"
                    />
                    <span className="label-text">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sys權限 */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Sys權限</span>
              </label>
              <div className="flex gap-6 items-center">
                {['Admin', 'None'].map((role) => (
                  <label key={`sys-${role}`} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sysRole"
                      value={role}
                      checked={formData.sysRole === role}
                      onChange={handleInputChange}
                      className="radio radio-primary"
                    />
                    <span className="label-text">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Org權限 */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Org權限</span>
              </label>
              <div className="flex gap-6 items-center flex-wrap">
                {['Admin', 'Factory', 'Manager', 'Enterprise', 'Company'].map((role) => (
                  <label key={`org-${role}`} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="orgRole"
                      value={role}
                      checked={formData.orgRole === role}
                      onChange={handleInputChange}
                      className="radio radio-primary"
                    />
                    <span className="label-text">{role}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

            <div className="card-actions justify-end">
              <button type="submit" className="btn btn-primary w-full">
                建立帳號
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>


  );
}
