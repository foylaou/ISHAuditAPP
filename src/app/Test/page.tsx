'use client';
import React, { useState } from 'react';
import { EnterpriseSelector } from "@/components/Selector/EnterpriseSelector";
import { SuggestcategorySelector } from "@/components/Selector/SuggestcategorySelector";
import { CitiesNameSelector } from "@/components/Selector/CitiesNameSelector";
import {useEnterprises} from "@/hooks/selector/useEnterprises";
import {useSuggestcategory} from "@/hooks/selector/useSuggestcategory";
import {useCitiesname} from "@/hooks/selector/useCitiesname";
import {SignaturePad} from "@/components/SignatureCanvas";

interface TestForm {
  enterpriseId: string;
  companyId: string;
  factoryId: string;
  cityInfoId: string;
  townshipsId: string;
  industrialareasId: string;
  suggestcategoryId: string;
  suggesttypeId: string;
  suggestitemId: string;
}

export default function Page() {
  const [formData, setFormData] = useState<TestForm>({
    enterpriseId: "",
    companyId: "",
    factoryId: "",
    cityInfoId: "",
    townshipsId: "",
    industrialareasId: "",
    suggestcategoryId: "",
    suggesttypeId: "",
    suggestitemId: "",
  });
    const handleSaveAction = (signature: string) => {
    console.log('簽名數據：', signature); // 簽名數據處理邏輯
  };
  // 獲取所有選擇器的數據和loading狀態
  const { refresh: refreshEnterprises, loading: enterprisesLoading } = useEnterprises();
  const { refresh: refreshCategories, loading: categoriesLoading } = useSuggestcategory();
  const { refresh: refreshCities, loading: citiesLoading } = useCitiesname();
  // 合併所有loading狀態
  const loading = enterprisesLoading || categoriesLoading || citiesLoading;

    const handleSaveSignature = (signatureData: string) => {
    // 處理簽名數據，例如：
    // - 保存到表單狀態
    // - 上傳到服務器
    // - 顯示在頁面上
    console.log('Signature saved:', signatureData);
  };

    // 刷新所有數據
  const handleRefresh = async () => {
    try {
      await Promise.all([
        refreshEnterprises(),
        refreshCategories(),
        refreshCities()
      ]);
    } catch (error) {
      console.error('刷新數據失敗:', error);
      alert('刷新數據失敗，請稍後再試');
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // 處理各個選擇器的級聯重置
      switch (name) {
        // 企業選擇器的重置邏輯
        case 'enterpriseId':
          newData.companyId = '';
          newData.factoryId = '';
          break;
        case 'companyId':
          newData.factoryId = '';
          break;

        // 城市選擇器的重置邏輯
        case 'cityInfoId':
          newData.townshipsId = '';
          newData.industrialareasId = '';
          break;
        case 'townshipsId':
          newData.industrialareasId = '';
          break;

        // 建議類別選擇器的重置邏輯
        case 'suggestcategoryId':
          newData.suggesttypeId = '';
          newData.suggestitemId = '';
          break;
        case 'suggesttypeId':
          newData.suggestitemId = '';
          break;
      }

      return newData;
    });
  };

  // 為了方便調試，顯示所有選擇的值
  const renderSelectedValues = () => {
    return Object.entries(formData).map(([key, value]) => (
      <p key={key}>Selected {key}: {value || '未選擇'}</p>
    ));
  };

  return (

      <div className="p-4 space-y-6">
        <div className="justify-between items-center">
          <h1 className="text-4xl font-bold text-center">數據選擇器</h1>
          <div className="flex">
            <button
                onClick={handleRefresh}
                className="btn btn-outline btn-sm"
                disabled={loading}
            >
              {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    更新中...
                  </>
              ) : '更新所有資料'}
            </button>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">企業選擇</h2>
            <EnterpriseSelector
                formData={formData}
                onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">建議類別選擇</h2>
            <SuggestcategorySelector
                formData={formData}
                onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">城市選擇</h2>
            <CitiesNameSelector
                formData={formData}
                onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="p-4">
          <SignaturePad onSaveAction={handleSaveSignature}/>


        </div>
        {/* 顯示所有選擇的值 */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">已選擇的值</h2>
            <div className="grid grid-cols-2 gap-4">
              {renderSelectedValues()}
            </div>
          </div>
        </div>
      </div>
  );
}
