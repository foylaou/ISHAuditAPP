import React, {useEffect, useState} from "react";
import {enterpriseService} from "@/services/enterpriseService";
import type {EnterPrise} from "@/types/Selector/enterPrise";
import {AuditQueryForm} from "@/types/auditType";
import {useEnterprises} from "@/hooks/selector/useEnterprises";
import {useSuggestcategory} from "@/hooks/selector/useSuggestcategory";
import {useCitiesname} from "@/hooks/selector/useCitiesname";


export default function SearchBar() {
      const { refresh: refreshEnterprises, loading: enterprisesLoading } = useEnterprises();
      const { refresh: refreshCategories, loading: categoriesLoading } = useSuggestcategory();
      const { refresh: refreshCities, loading: citiesLoading } = useCitiesname();
        // 合併所有loading狀態
      const loading = enterprisesLoading || categoriesLoading || citiesLoading;
      const [formData, setFormData] = useState<AuditQueryForm>({
    citiesId:'',
    townshipsId:'',
    industrialAreasId:'',
    AuditTypeId:'',
    AuditCauseId:'',
    AuditItemsId:'',
    AuditDate:'',
    enterpriseId: '',
    companyId: '',
    factoryId: '',
  });
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
          newData.industrialAreasId = '';
          break;
        case 'townshipsId':
          newData.industrialAreasId = '';
          break;


      }

      return newData;
    });
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
       </div>
  );
}
