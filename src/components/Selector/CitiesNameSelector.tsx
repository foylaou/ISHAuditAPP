// components/CitiesNameSelector.tsx

import React from "react";
import {citiesnameService} from "@/services/citiesnameService";
import {useCitiesname} from "@/hooks/selector/useCitiesname";
import {CityInfoForm, IndustrialAreas, Townships} from "@/types/Selector/citiesName";

interface CitiesNameSelectorProps {
  formData: CityInfoForm;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function CitiesNameSelector({ formData, onChange }: CitiesNameSelectorProps) {
  const { Citiesname, loading, refresh } = useCitiesname();

  const Townships = formData.cityInfoId
    ? citiesnameService.getTownshipsByCityInfoId(Citiesname, formData.cityInfoId)
    : [];

  const IndustrialAreas = formData.townshipsId
    ? citiesnameService.getIndustrialAreasByTownshipId(Citiesname, formData.townshipsId)
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
            <span className="label-text">所在縣市</span>
          </label>
          <select
            name="cityInfoId"
            value={formData.cityInfoId}
            onChange={onChange}
            className="select select-bordered w-full bg-base-100 text-base-content"
            required
          >
            <option value="">--請選擇--</option>
            {Citiesname.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">所在地區</span>
          </label>
          <select
            name="townshipsId"
            value={formData.townshipsId}
            onChange={onChange}
            className="select select-bordered w-full bg-base-100 text-base-content"
            disabled={!formData.cityInfoId}
            required
          >
            <option value="">--請選擇--</option>
            {Townships.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">所屬工業區</span>
          </label>
          <select
            name="industrialareasId"
            value={formData.industrialareasId}
            onChange={onChange}
            className="select select-bordered w-full bg-base-100 text-base-content"
            disabled={!formData.cityInfoId}
            required
          >
            <option value="">--請選擇--</option>
            {IndustrialAreas.map(i => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
