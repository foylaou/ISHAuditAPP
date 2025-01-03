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
  const { suggestcategory, loading, refresh } = useSuggestcategory();

  const suggesttypes = formData.suggestcategoryId
    ? suggestcategoryService.getSuggestTypesBySuggestCategorId(suggestcategory, formData.suggestcategoryId)
    : [];

  const suggestitems = formData.suggestcategoryId
    ? suggestcategoryService.getSuggestItemsBySuggestTypeId(suggestcategory, formData.suggestcategoryId)
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
            name="suggestcategoryId"
            value={formData.suggestcategoryId}
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
            name="suggesttypeId"
            value={formData.suggesttypeId}
            onChange={onChange}
            className="select select-bordered w-full bg-base-100 text-base-content"
            disabled={!formData.suggestcategoryId}
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
            name="suggestitemId"
            value={formData.suggestitemId}
            onChange={onChange}
            className="select select-bordered w-full bg-base-100 text-base-content"
            disabled={!formData.suggesttypeId}
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
