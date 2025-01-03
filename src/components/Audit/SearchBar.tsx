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
        // 合併所有loading狀態
      const loading = enterprisesLoading || categoriesLoading || citiesLoading;
      const [formData, setFormData] = useState<AuditQueryForm>({
    cityInfoId: "",
    townshipsId: "",
    industrialareasId: "",
    AuditTypeId:'',
    AuditCauseId:'',
    AuditItemsId:'',
    AuditDate:'',
    enterpriseId: '',
    companyId: '',
    factoryId: '',
    suggestcategoryId: "",
    suggesttypeId: "",
    suggestitemId: "",

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
                    newData.suggesttypeId = "";
                    newData.suggestitemId = "";
                    break;
                case "suggesttypeId":
                    newData.suggestitemId = "";
                    break;
            }

            return newData;
        });
    }, []);


  return (
      <div className="p-4  relative  pb-2">
          {/* 功能按鈕區域 */}
          <div className="justify-between items-center">
              <div className="flex gap-2">
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

          {/* 卡片選單區域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {loading ? (
                  // 載入中的骨架屏
                  <>
                      <div className="card bg-base-100 shadow-xl">
                          <div className="card-body">
                              <div className="skeleton h-4 w-28 mb-4"></div>
                              <div className="skeleton h-32 w-full"></div>
                              <div className="skeleton h-4 w-full"></div>
                              <div className="skeleton h-4 w-3/4"></div>
                          </div>
                      </div>
                      <div className="card bg-base-100 shadow-xl">
                          <div className="card-body">
                              <div className="skeleton h-4 w-28 mb-4"></div>
                              <div className="skeleton h-32 w-full"></div>
                              <div className="skeleton h-4 w-full"></div>
                              <div className="skeleton h-4 w-3/4"></div>
                          </div>
                      </div>
                      <div className="card bg-base-100 shadow-xl">
                          <div className="card-body">
                              <div className="skeleton h-4 w-28 mb-4"></div>
                              <div className="skeleton h-32 w-full"></div>
                              <div className="skeleton h-4 w-full"></div>
                              <div className="skeleton h-4 w-3/4"></div>
                          </div>
                      </div>
                      <div className="card bg-base-100 shadow-xl">
                          <div className="card-body">
                              <div className="skeleton h-4 w-28 mb-4"></div>
                              <div className="skeleton h-32 w-full"></div>
                              <div className="skeleton h-4 w-full"></div>
                              <div className="skeleton h-4 w-3/4"></div>
                          </div>
                      </div>
                  </>
              ) : (
                  // 實際的卡片內容
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

                      <div className="card bg-base-200 shadow-xl">
                          <div className="card-body text-base-content">
                              <span>督導年份</span>
                              <DataRangePicker/>
                              <h2 className="card-title">督導細節</h2>
                              <span>災害類型</span>
                              <DisasterTypeSelect/>
                              <span>是否裁罰？</span>
                              <select
                                  className="select select-bordered text-base-content"
                                  value={isPenalty}
                                  onChange={(e) => setIsPenalty(e.target.value)}
                              >
                                  <option disabled value="--請選擇--">--請選擇--</option>
                                  <option value="是">是</option>
                                  <option value="否">否</option>
                              </select>

                              <span>是否停工？</span>
                              <select
                                  className="select select-bordered text-base-content "
                                  value={isWorkStopped}
                                  onChange={(e) => setIsWorkStopped(e.target.value)}
                              >
                                  <option disabled value="--請選擇--">--請選擇--</option>
                                  <option value="是">是</option>
                                  <option value="否">否</option>
                              </select>

                          </div>
                      </div>
                  </>
              )}

          </div>
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-base-100 border-t md:static md:border-0 md:p-0 md:mt-4">
              <div className="max-w-screen-xl mx-auto flex justify-end">
                  <button className="btn btn-primary rounded-full w-full md:w-auto">
                      搜尋
                  </button>
              </div>
          </div>
      </div>
  );
}
