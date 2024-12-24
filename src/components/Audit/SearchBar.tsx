import React, {useEffect, useState} from "react";
import {enterpriseService} from "@/services/enterpriseService";
import type {EnterPrise} from "@/types/Selector/enterPrise";
import {AuditQueryForm} from "@/types/auditType";


export default function SearchBar() {
      const [enterprises, setEnterprises] = useState<EnterPrise[]>([]);
      const [loading, setLoading] = useState(true);
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


  useEffect(() => {
    async function fetchData() {
      try {
        const data = await enterpriseService.getAllEnterprises();
        setEnterprises(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const companies = formData.enterpriseId
    ? enterpriseService.getCompaniesByEnterpriseId(enterprises, formData.enterpriseId)
    : [];

  const factories = formData.companyId
    ? enterpriseService.getFactoriesByCompanyId(enterprises, formData.companyId)
    : [];




  return (
      <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
        {/* 頭部區域 */}
          <div className="p-6 border-b">
              <div className="p-6 text-base-content">
                  {/* 地區 */}
                  <div className="form-control w-full">
                      <label className="label">
                          <span className="label-text">所在縣市</span>
                      </label>
                      <select
                          name="citiesId"
                          value={}
                          onChange={}
                          className="select select-bordered w-full"
                          required
                      >
                          <option value="">--請選擇--</option>
                          {items.map(item => (
                              <option key={item.id} value={item.id}>
                                  {item.name}
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
                          value={}
                          onChange={}
                          className="select select-bordered w-full"
                          required
                      >
                          <option value="">--請選擇--</option>
                          {items.map(item => (
                              <option key={item.id} value={item.id}>
                                  {item.name}
                              </option>
                          ))}
                      </select>
                  </div>

                  <div className="form-control w-full">
                      <label className="label">
                          <span className="label-text">所屬工業區</span>
                      </label>
                      <select
                          name="industrialAreasId"
                          value={}
                          onChange={}
                          className="select select-bordered w-full"
                          required
                      >
                          <option value="">--請選擇--</option>
                          {items.map(item => (
                              <option key={item.id} value={item.id}>
                                  {item.name}
                              </option>
                          ))}
                      </select>
                  </div>
                  {/* 督導類形 */}
                  <div className="form-control w-full">
                      <label className="label">
                          <span className="label-text">督導種類</span>
                      </label>
                      <select
                          name="enterpriseId"
                          value={}
                          onChange={}
                          className="select select-bordered w-full"
                          required
                      >
                          <option value="">--請選擇--</option>
                          {items.map(item => (
                              <option key={item.id} value={item.id}>
                                  {item.name}
                              </option>
                          ))}
                      </select>
                  </div>

                  <div className="form-control w-full">
                      <label className="label">
                          <span className="label-text">督導原因</span>
                      </label>
                      <select
                          name="enterpriseId"
                          value={}
                          onChange={}
                          className="select select-bordered w-full"
                          required
                      >
                          <option value="">--請選擇--</option>
                          {items.map(item => (
                              <option key={item.id} value={item.id}>
                                  {item.name}
                              </option>
                          ))}
                      </select>
                  </div>


                  <div className="form-control w-full">
                      <label className="label">
                          <span className="label-text">災害類型</span>
                      </label>
                      <select
                          name="enterpriseId"
                          value={}
                          onChange={}
                          className="select select-bordered w-full"
                          required
                      >
                          <option value="">--請選擇--</option>
                          {items.map(item => (
                              <option key={item.id} value={item.id}>
                                  {item.name}
                              </option>
                          ))}
                      </select>
                  </div>

                  <div className="form-control w-full">
                      <label className="label">
                          <span className="label-text">督導年份</span>
                      </label>
                      <select
                          name="enterpriseId"
                          value={}
                          onChange={}
                          className="select select-bordered w-full"
                          required
                      >
                          <option value="">--請選擇--</option>
                          {items.map(item => (
                              <option key={item.id} value={item.id}>
                                  {item.name}
                              </option>
                          ))}
                      </select>
                  </div>
                  {/* 企業、公司、工廠 */}
                  <div className="form-control w-full">
                      <label className="label">
                          <span className="label-text">公司名稱</span>
                      </label>
                      <select
                          name="enterpriseId"
                          value={}
                          onChange={}
                          className="select select-bordered w-full"

                      >
                          <option value="">--請選擇--</option>
                          {items.map(item => (
                              <option key={item.id} value={item.id}>
                                  {item.name}
                              </option>
                          ))}
                      </select>
                  </div>

                  <div className="form-control w-full">
                      <label className="label">
                          <span className="label-text">工廠名稱</span>
                      </label>
                      <select
                          name="enterpriseId"
                          value={}
                          onChange={}
                          className="select select-bordered w-full"

                      >
                          <option value="">--請選擇--</option>
                          {items.map(item => (
                              <option key={item.id} value={item.id}>
                                  {item.name}
                              </option>
                          ))}
                      </select>
                  </div>
                  {/* 建議種類 */}
                  <div className="form-control w-full">
                      <label className="label">
                          <span className="label-text">建議種類</span>
                      </label>
                      <select
                          name="enterpriseId"
                          value={}
                          onChange={}
                          className="select select-bordered w-full"

                      >
                          <option value="">--請選擇--</option>
                          {items.map(item => (
                              <option key={item.id} value={item.id}>
                                  {item.name}
                              </option>
                          ))}
                      </select>
                  </div>

                  <div className="form-control w-full">
                      <label className="label">
                          <span className="label-text">建議類型</span>
                      </label>
                      <select
                          name="enterpriseId"
                          value={}
                          onChange={}
                          className="select select-bordered w-full"

                      >
                          <option value="">--請選擇--</option>
                          {items.map(item => (
                              <option key={item.id} value={item.id}>
                                  {item.name}
                              </option>
                          ))}
                      </select>
                  </div>

                  <div className="form-control w-full">
                      <label className="label">
                          <span className="label-text">建議項目</span>
                      </label>
                      <select
                          name="enterpriseId"
                          value={}
                          onChange={}
                          className="select select-bordered w-full"

                      >
                          <option value="">--請選擇--</option>
                          {items.map(item => (
                              <option key={item.id} value={item.id}>
                                  {item.name}
                              </option>
                          ))}
                      </select>
                  </div>

                  {/* 是否 */}
                  <div className="form-control w-full">
                      <label className="label">
                          <span className="label-text">是否停工</span>
                      </label>
                      <select
                          name="enterpriseId"
                          value={}
                          onChange={}
                          className="select select-bordered w-full"

                      >
                          <option value="">--請選擇--</option>
                          {items.map(item => (
                              <option key={item.id} value={item.id}>
                                  {item.name}
                              </option>
                          ))}
                      </select>
                  </div>

                  <div className="form-control w-full">
                      <label className="label">
                          <span className="label-text">是否裁罰</span>
                      </label>
                      <select
                          name="enterpriseId"
                          value={}
                          onChange={}
                          className="select select-bordered w-full"

                      >
                          <option value="">--請選擇--</option>
                          {items.map(item => (
                              <option key={item.id} value={item.id}>
                                  {item.name}
                              </option>
                          ))}
                      </select>
                  </div>

                  <div className="form-control w-full">
                      <label className="label">
                          <span className="label-text">完成改善</span>
                      </label>
                      <select
                          name="enterpriseId"
                          value={}
                          onChange={}
                          className="select select-bordered w-full"

                      >
                          <option value="">--請選擇--</option>
                          {items.map(item => (
                              <option key={item.id} value={item.id}>
                                  {item.name}
                              </option>
                          ))}
                      </select>
                  </div>


              </div>
          </div>
      </div>
  );
}
