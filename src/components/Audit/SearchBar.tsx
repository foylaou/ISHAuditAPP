import React, {useCallback, useState} from "react";
import {AuditQueryForm} from "@/types/auditType";
import {useEnterprises} from "@/hooks/selector/useEnterprises";
import {useSuggestcategory} from "@/hooks/selector/useSuggestcategory";
import {useCitiesname} from "@/hooks/selector/useCitiesname";
import {toast} from 'react-toastify';
import {EnterpriseSelector} from "@/components/Selector/EnterpriseSelector";
import {SuggestcategorySelector} from "@/components/Selector/SuggestcategorySelector";
import {CitiesNameSelector} from "@/components/Selector/CitiesNameSelector";
import DataRangePicker from "@/components/ui/DataRangePicker";
import DisasterTypeSelect from "@/components/Selector/DisasterTypeSelector";

export default function SearchBar() {
      const { refresh: refreshEnterprises, loading: enterprisesLoading } = useEnterprises();
      const { refresh: refreshCategories, loading: categoriesLoading } = useSuggestcategory();
      const { refresh: refreshCities, loading: citiesLoading } = useCitiesname();
      const [isPenalty, setIsPenalty] = useState('--請選擇--');
      const [isWorkStopped, setIsWorkStopped] = useState('--請選擇--');
      const [isParticipate, setIsParticipate] = useState('--請選擇--');
      const [isImproveStatus, setIsImproveStatus] = useState('--請選擇--');
        // 合併所有loading狀態
      const loading = enterprisesLoading || categoriesLoading || citiesLoading;
      const [formData, setFormData] = useState<AuditQueryForm>({
    cityInfoId: "",
    townshipsId: "",
    industrialareasId: "",
    auditTypeId: "",
    auditCauseId: "",
    auditItemsId: "",
    auditDate: "",
    enterpriseId: "",
    companyId: "",
    factoryId: "",
    suggestCategoryId: "",
    suggestTypeId: "",
    suggestItemId: ""
  });



    // 刷新所有數據
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
      type: 'success', // 修改為成功類型
      isLoading: false, // 結束加載狀態
      autoClose: 3000, // 3 秒後自動關閉
    });

    } catch (error) {
      console.error('刷新數據失敗:', error);
      toast.error('刷新數據失敗，請稍後再試'+error);
    }
  };

    const handleInputChange = useCallback((
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const {name, value} = e.target;
        setFormData(prev => {
            const newData = {...prev, [name]: value};

            // 處理各個選擇器的級聯重置
            switch (name) {
                // 企業選擇器的重置邏輯
                case "enterpriseId":
                    newData.companyId = "";
                    newData.factoryId = "";
                    break;
                case "companyId":
                    newData.factoryId = "";
                    break;

                // 城市選擇器的重置邏輯
                case "cityInfoId":
                    newData.townshipsId = "";
                    newData.industrialareasId = "";
                    break;
                case "townshipsId":
                    newData.industrialareasId = "";
                    break;

                // 建議類別選擇器的重置邏輯
                case "suggestcategoryId":
                    newData.suggestTypeId = "";
                    newData.suggestItemId = "";
                    break;
                case "suggesttypeId":
                    newData.suggestItemId = "";
                    break;
            }

            return newData;
        });
    }, []);


  return (
      <>

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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? (
                      // 載入中的骨架屏 - 只顯示三個卡片
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
                          {/* 前三個選擇器卡片 */}
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

              {/* 第四張卡片 - 督導細節 */}
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
                  <button className="btn rounded-full btn-primary btn-lg md:w-32 w-full">
                      搜尋
                  </button>
              </div>
          </div>
          </>
          );
          }
