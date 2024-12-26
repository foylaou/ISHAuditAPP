// components/EnterpriseSelector.tsx
import { RegisterForm } from "@/types/registerType";
import { useEnterprises } from '@/hooks/selector/useEnterprises';
import { enterpriseService } from "@/services/enterpriseService";
import React from "react";
import {EnterPriseForm} from "@/types/Selector/enterPrise";

interface EnterpriseSelectorProps {
  formData: EnterPriseForm;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function EnterpriseSelector({ formData, onChange }: EnterpriseSelectorProps) {
  const { enterprises, loading, refresh } = useEnterprises();

  const companies = formData.enterpriseId
    ? enterpriseService.getCompaniesByEnterpriseId(enterprises, formData.enterpriseId)
    : [];

  const factories = formData.companyId
    ? enterpriseService.getFactoriesByCompanyId(enterprises, formData.companyId)
    : [];

  if (loading) {
    return <div className="loading loading-spinner loading-lg"></div>;
  }

  return (
    <div className="space-y-4">
      {/* EnterPrise Selection */}
      <div className="divider"></div>
      <div className="space-y-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">企業名稱</span>
          </label>
          <select
            name="enterpriseId"
            value={formData.enterpriseId}
            onChange={onChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">--請選擇--</option>
            {enterprises.map(enterprise => (
              <option key={enterprise.id} value={enterprise.id}>
                {enterprise.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">公司名稱</span>
          </label>
          <select
            name="companyId"
            value={formData.companyId}
            onChange={onChange}
            className="select select-bordered w-full"
            disabled={!formData.enterpriseId}
            required
          >
            <option value="">--請選擇--</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">工廠名稱</span>
          </label>
          <select
            name="factoryId"
            value={formData.factoryId}
            onChange={onChange}
            className="select select-bordered w-full"
            disabled={!formData.companyId}
            required
          >
            <option value="">--請選擇--</option>
            {factories.map(factory => (
              <option key={factory.id} value={factory.id}>
                {factory.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
