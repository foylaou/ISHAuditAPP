// components/SuggestcategorySelector.tsx

import React from "react";
import {useSuggestcategory} from "@/hooks/selector/useSuggestcategory";
import {suggestcategoryService} from "@/services/suggestcategoryService";
import {SuggestCategoryForm} from "@/types/Selector/suggestCategory";

interface SuggestcategorySelectorProps {
  formData: SuggestCategoryForm;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function SuggestcategorySelector({ formData, onChange }: SuggestcategorySelectorProps) {
  const { suggestcategory, loading } = useSuggestcategory();

  const suggesttypes = formData.suggestCategoryId
    ? suggestcategoryService.getSuggestTypesBySuggestCategorId(suggestcategory, formData.suggestCategoryId)
    : [];

  const suggestitems = formData.suggestCategoryId
    ? suggestcategoryService.getSuggestItemsBySuggestTypeId(suggestcategory, formData.suggestCategoryId)
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
            <span className="label-text">建議種類</span>
          </label>
          <select
            name="suggestCategoryId"
            value={formData.suggestCategoryId}
            onChange={onChange}

            className="select select-bordered w-full bg-base-100 text-base-content"
            required
          >
            <option value="">--請選擇--</option>
            {suggestcategory.map(suggestcategory => (
              <option key={suggestcategory.id} value={suggestcategory.id}>
                {suggestcategory.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">建議類型</span>
          </label>
          <select
            name="suggestTypeId"
            value={formData.suggestTypeId}
            onChange={onChange}
            className="select select-bordered w-full bg-base-100 text-base-content"
            disabled={!formData.suggestCategoryId}
            required
          >
            <option value="">--請選擇--</option>
            {suggesttypes.map(SuggestType => (
              <option key={SuggestType.id} value={SuggestType.id}>
                {SuggestType.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">建議項目</span>
          </label>
          <select
            name="suggestItemId"
            value={formData.suggestItemId}
            onChange={onChange}
            className="select select-bordered w-full bg-base-100 text-base-content"
            disabled={!formData.suggestTypeId}
            required
          >
            <option value="">--請選擇--</option>
            {suggestitems.map(suggestitem => (
              <option key={suggestitem.id} value={suggestitem.id}>
                {suggestitem.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
