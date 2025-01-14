'use client';
import React, { useState } from 'react';

interface SelectedOption {
  name: string;
  value: string;
}

const DISASTER_TYPES = {
  FIRE: { name: '火災', value: 'fire' },
  EXPLOSION: { name: '爆炸', value: 'explosion' },
  FALL: { name: '墜落', value: 'fall' },
  ELECTRIC: { name: '感電', value: 'electric' },
  COLLAPSE: { name: '倒塌', value: 'collapse' },
  OTHER: { name: '其他', value: 'other' }
} as const;

export default function DisasterTypeSelect() {
  const [selectedTypes, setSelectedTypes] = useState<SelectedOption[]>([]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedType = Object.values(DISASTER_TYPES).find(
      type => type.value === selectedValue
    );

    if (selectedType && !selectedTypes.some(type => type.value === selectedValue)) {
      setSelectedTypes([...selectedTypes, selectedType]);
    }
    // 重置選單到預設選項
    e.target.value = '';
  };

  const removeType = (valueToRemove: string) => {
    setSelectedTypes(selectedTypes.filter(type => type.value !== valueToRemove));
  };

  return (
      <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
              <select
                  className="select select-bordered w-32 text-base-content"
                  onChange={handleSelect}
                  value=""
              >
                  <option value="" disabled>
                      --請選擇--
                  </option>
                  {Object.values(DISASTER_TYPES).map(type => (
                      <option
                          key={type.value}
                          value={type.value}
                          disabled={selectedTypes.some(selected => selected.value === type.value)}
                      >
                          {type.name}
                      </option>
                  ))}
              </select>
          </div>

          {/* 已選擇的泡泡 */}
          <div
              className="flex flex-wrap gap-2 mt-2 p-3 border border-base-300 rounded-lg shadow-md bg-base-100 min-h-[2.5rem]">

              {selectedTypes.map(type => (
                  <div
                      key={type.value}
                      className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-base-content rounded-full"
                  >
                      <span>{type.name}</span>
                      <button
                          onClick={() => removeType(type.value)}
                          className="hover:text-primary-focus"
                      >
                          ×
                      </button>
                  </div>
              ))}
          </div>

      </div>

  );
}
