import React, {useCallback, useState} from "react";
import {useEnterprises} from "@/hooks/selector/useEnterprises";
import {useSuggestcategory} from "@/hooks/selector/useSuggestcategory";
import {useCitiesname} from "@/hooks/selector/useCitiesname";
import {toast} from 'react-toastify';
import { EnterpriseSelector }  from "@/components/Selector/EnterpriseSelector";
import { SuggestcategorySelector } from "@/components/Selector/SuggestcategorySelector";
import { CitiesNameSelector } from "@/components/Selector/CitiesNameSelector";
import DataRangePicker from "@/components/ui/DataRangePicker";
import DisasterTypeSelect from "@/components/Selector/DisasterTypeSelector";
import { useAuditStore } from "@/store/useAuditStore";
import { auditQueryService } from "@/services/Audit/auditQueryService";
import { AuditQuery } from "@/types/AuditQuery/auditQuery";


export default function SearchBar() {
  const { refresh: refreshEnterprises, loading: enterprisesLoading } = useEnterprises();
  const { refresh: refreshCategories, loading: categoriesLoading } = useSuggestcategory();
  const { refresh: refreshCities, loading: citiesLoading } = useCitiesname();
  const setAuditData = useAuditStore(state => state.setAuditData);

  const [isPenalty, setIsPenalty] = useState('--請選擇--');
  const [isWorkStopped, setIsWorkStopped] = useState('--請選擇--');
  const [isParticipate, setIsParticipate] = useState('--請選擇--');
  const [isImproveStatus, setIsImproveStatus] = useState('--請選擇--');
  const [isSearching, setIsSearching] = useState(false);

  // 合併所有loading狀態
  const loading = enterprisesLoading || categoriesLoading || citiesLoading;

  const [formData, setFormData] = useState<AuditQuery>({
  cityInfoId: "", // 城市 ID
  townshipsId: "", // 鄉鎮 ID
  industrialareasId: "", // 工業區 ID
  auditCauseId: "", // 企業 ID
  auditItemsId: "", // 公司 ID
  disasterType: "", // 災害類型 ID（逗號分隔）
  auditDate: "", // 督導年份
  enterpriseId:"",
  companyId:"",
  factoryId: "", // 工廠 ID
  suggestCategoryId: "",
  suggestTypeId: "",
  suggestItemId: "",
  improveStatus: "", // 改善狀態（"Y" 或 "N"）
  participate: "", // 是否參與（"Y" 或 "N"）
  });



  const handleSearch = async () => {
    try {
      setIsSearching(true);
      const searchData = {
        ...formData,
        isPenalty: isPenalty !== '--請選擇--' ? isPenalty : '',
        isWorkStopped: isWorkStopped !== '--請選擇--' ? isWorkStopped : '',
        isParticipate: isParticipate !== '--請選擇--' ? isParticipate : '',
        isImproveStatus: isImproveStatus !== '--請選擇--' ? isImproveStatus : ''
      };

      const data = await auditQueryService.queryAudit(searchData);



      if (data) {
        setAuditData(data);
        toast.success('搜尋成功！');
      } else {
        toast.warn('未找到符合條件的數據');
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error during search:', errorMessage);
      toast.error(`搜尋失敗：${errorMessage}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRefresh = async () => {
    try {
      const toastId = toast.loading('更新中...');
      await Promise.all([
        refreshEnterprises(),
        refreshCategories(),
        refreshCities()
      ]);
      toast.update(toastId, {
        render: '更新成功！',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error('刷新數據失敗:', error);
      toast.error(`刷新數據失敗，請稍後再試: ${error}`);
    }
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const {name, value} = e.target;
      setFormData(prev => {
        const newData = {...prev, [name]: value};
        switch (name) {
          case "enterpriseId":
            newData.companyId = "";
            newData.factoryId = "";
            break;
          case "companyId":
            newData.factoryId = "";
            break;
          case "cityInfoId":
            newData.townshipsId = "";
            newData.industrialareasId = "";
            break;
          case "townshipsId":
            newData.industrialareasId = "";
            break;
          case "suggestCategoryId":
            newData.suggestTypeId = "";
            newData.suggestItemId = "";
            break;
          case "suggestTypeId":
            newData.suggestItemId = "";
            break;
        }
        return newData;
      });
    },
    []
  );

  return (
      <div className="container mx-auto p-4 space-y-6">
        {/* 功能按鈕區域 */}
        <div className="w-full">
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

        {/* 搜尋選項 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
              // 載入中的骨架屏
              Array(3).fill(null).map((_, index) => (
                  <div key={index} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="skeleton h-4 w-28 mb-4"></div>
                      <div className="skeleton h-32 w-full"></div>
                      <div className="skeleton h-4 w-full"></div>
                      <div className="skeleton h-4 w-3/4"></div>
                    </div>
                  </div>
              ))
          ) : (
              <>
                <div className="card bg-base-200 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-base-content">企業選擇</h2>
                    <EnterpriseSelector
                        formData={formData}
                        onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="card bg-base-200 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-base-content">建議類別選擇</h2>
                    <SuggestcategorySelector
                        formData={formData}
                        onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="card bg-base-200 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-base-content">城市選擇</h2>
                    <CitiesNameSelector
                        formData={formData}
                        onChange={handleInputChange}
                    />
                  </div>
                </div>
              </>
          )}
        </div>

        {/* 督導細節 */}
        {!loading && (
            <div className="w-full">
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <span className="text-base-content font-medium">督導年份</span>
                      <DataRangePicker/>
                    </div>
                    <div className="space-y-2">
                      <span className="text-base-content font-medium">災害類型</span>
                      <DisasterTypeSelect/>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <span className="text-base-content font-medium">是否裁罰？</span>
                      <select
                          className="select select-bordered w-full text-base-content"
                          value={isPenalty}
                          onChange={(e) => setIsPenalty(e.target.value)}
                      >
                        <option disabled value="--請選擇--">--請選擇--</option>
                        <option value="是">是</option>
                        <option value="否">否</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <span className="text-base-content font-medium">是否停工？</span>
                      <select
                          className="select select-bordered w-full text-base-content"
                          value={isWorkStopped}
                          onChange={(e) => setIsWorkStopped(e.target.value)}
                      >
                        <option disabled value="--請選擇--">--請選擇--</option>
                        <option value="Y">是</option>
                        <option value="N">否</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <span className="text-base-content font-medium">是否參採建議？</span>
                      <select
                          className="select select-bordered w-full text-base-content"
                          value={isParticipate}
                          onChange={(e) => setIsParticipate(e.target.value)}
                      >
                        <option disabled value="--請選擇--">--請選擇--</option>
                        <option value="Y">是</option>
                        <option value="N">否</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <span className="text-base-content font-medium">是否完成改善？</span>
                      <select
                          className="select select-bordered w-full text-base-content"
                          value={isImproveStatus}
                          onChange={(e) => setIsImproveStatus(e.target.value)}
                      >
                        <option disabled value="--請選擇--">--請選擇--</option>
                        <option value="Y">是</option>
                        <option value="N">否</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}
        {/* 搜尋按鈕 */}
        <div className="w-full flex justify-end mt-6">
          <button
              className="btn rounded-full btn-primary btn-lg md:w-32 w-full"
              onClick={handleSearch}
              disabled={isSearching}
          >
            {isSearching ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  搜尋中...
                </>
            ) : '搜尋'}
          </button>
        </div>
      </div>
  );
}
