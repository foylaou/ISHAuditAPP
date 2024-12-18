// app/signup/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { enterpriseService } from '@/services/enterpriseService';
import type { Enterprise } from '@/types/enterprise';

interface FormData {
  username: string;
  password: string;
  name: string;
  enterpriseId: string;
  companyId: string;
  factoryId: string;
  auditRole: 'Admin' | 'Power' | 'Operator' | 'None';
  kpiRole: 'Admin' | 'Power' | 'Operator' | 'None';
  sysRole: 'Admin' | 'None';
  orgRole: 'Admin' | 'Factory' | 'Manager' | 'Enterprise' | 'Company';
}

export default function SignupPage() {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    name: '',
    enterpriseId: '',
    companyId: '',
    factoryId: '',
    auditRole: 'None',
    kpiRole: 'None',
    sysRole: 'None',
    orgRole: 'Factory'
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await enterpriseService.getAllEnterprises();
        setEnterprises(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const companies = formData.enterpriseId
    ? enterpriseService.getCompaniesByEnterpriseId(enterprises, formData.enterpriseId)
    : [];

  const factories = formData.companyId
    ? enterpriseService.getFactoriesByCompanyId(enterprises, formData.companyId)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to create user
    console.log('Form data:', formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Reset dependent fields when parent selection changes
      if (name === 'enterpriseId') {
        newData.companyId = '';
        newData.factoryId = '';
      } else if (name === 'companyId') {
        newData.factoryId = '';
      }
      return newData;
    });
  };
  // 添加手動刷新功能
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await enterpriseService.forceRefresh();
      setEnterprises(data);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading loading-spinner loading-lg"></div>;
  }


  return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">建立人員帳號</h1>
        <button
            onClick={handleRefresh}
            className="btn btn-outline btn-sm"
            disabled={loading}
        >
          {loading ? <span className="loading loading-spinner"></span> : '刷新企業資料'}
        </button>
        <form onSubmit={handleSubmit} className="form-control w-full max-w-lg gap-4">
          {/* Basic Information */}
          <div className="grid gap-4">
            <div>
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

            <div>
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

            <div>
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

          {/* Enterprise Selection */}
          <div className="grid gap-4">
            <div>
              <label className="label">
                <span className="label-text">企業</span>
              </label>
              <select
                  name="enterpriseId"
                  value={formData.enterpriseId}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                  required
              >
                <option value="">選擇企業</option>
                {enterprises.map(enterprise => (
                    <option key={enterprise.id} value={enterprise.id}>
                      {enterprise.name}
                    </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text">公司</span>
              </label>
              <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                  disabled={!formData.enterpriseId}
                  required
              >
                <option value="">選擇公司</option>
                {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text">工廠</span>
              </label>
              <select
                  name="factoryId"
                  value={formData.factoryId}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                  disabled={!formData.companyId}
                  required
              >
                <option value="">選擇工廠</option>
                {factories.map(factory => (
                    <option key={factory.id} value={factory.id}>
                      {factory.name}
                    </option>
                ))}
              </select>
            </div>
          </div>

          {/* Permissions */}
          <div className="grid gap-4">
            <div>
              <label className="label">
                <span className="label-text">Audit權限</span>
              </label>
              <select
                  name="auditRole"
                  value={formData.auditRole}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
              >
                {['Admin', 'Power', 'Operator', 'None'].map(role => (
                    <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text">KPI權限</span>
              </label>
              <select
                  name="kpiRole"
                  value={formData.kpiRole}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
              >
                {['Admin', 'Power', 'Operator', 'None'].map(role => (
                    <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text">Sys權限</span>
              </label>
              <select
                  name="sysRole"
                  value={formData.sysRole}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
              >
                {['Admin', 'None'].map(role => (
                    <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text">Org權限</span>
              </label>
              <select
                  name="orgRole"
                  value={formData.orgRole}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
              >
                {['Admin', 'Factory', 'Manager', 'Enterprise', 'Company'].map(role => (
                    <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-6">
            建立帳號
          </button>
        </form>
      </div>
  );
}
