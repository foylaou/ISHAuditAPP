import axios from 'axios';
import getAuthtoken from "@/services/Auth/serverAuthService";
import {BasicInfoData} from "@/components/Audit/AuditInfo/BasicInfo";
import {DetailType} from "@/components/Audit/AuditInfo/AuditDetailModal";
import {AuditDetail} from "@/components/Audit/AuditInfo/SupervisionProgress";
import {AuditBasicResult, AuditQuery} from "@/types/AuditQuery/auditQuery";
import {headers} from "next/headers";
import {AuditEditResult} from "@/components/Auditedit/AuditeditBasicInfo";
import {AuditInfoSuggest} from "@/components/Auditedit/AuditInfoSuggest";

const api = axios.create({
  baseURL: '/proxy',  // API請求的基礎路徑
  timeout: 10000, // 超時設置
});

interface AuditeditVerification {
  auditId:string;
  email:string;
  verificationCode:string;
}
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// 📌 **請求攔截器：自動附加 `Authorization: Bearer <Token>`**
api.interceptors.request.use(async (config) => {
  const token = await getAuthtoken(); // 從 Cookie 取得 Token

  if (token) {
    config.headers.Authorization = `Bearer ${token.value}`;
  } else {
    console.warn("⚠️ 無 Token，請求將不攜帶 Authorization");
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * 督導查詢服務
 * 提供企業、公司、工廠等層級數據的管理功能
 */
export const auditQueryService = {
  async GetBasicInformation(uuid: string): Promise<BasicInfoData | null> {
    try {
      const response = await api.get(`/Audit/GetBasicInformation`, {
        params: {
          Uuid: uuid
        }
      });
      // Check if the API call was successful
      if (response.status === 200 && response.data.success) {
        // Extract the actual data from the response
        const supervisoryData: BasicInfoData = response.data.data;
        return supervisoryData;
      } else {
        console.error('Error fetching data:', response.data.message);
        return null;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
        throw error;
      } else {
        console.error('Unexpected error:', error);
        throw new Error('different error than axios');
      }
    }
  },
  async GetEnterType(): Promise<DetailType[]> {
    try {
      const response = await api.get(`/Audit/GetEnterType`);

      if (response.status === 200 && response.data.success) {
        return response.data.data;
      } else {
        // 處理 API 返回非成功的情況
        console.error('API returned error:', response.data);
        throw new Error(response.data.message || 'Failed to fetch detail types');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // 重新拋出錯誤以便調用者能處理
      throw error;
    }
    return [];
  },
  async GetAuditDetailInfo(uuid:string): Promise<AuditDetail[]|null> {
    try {
      const response = await api.get(`/Audit/GetAuditDetailInfo`,
          {
        params: {
          Uuid: uuid
        }
      });

      if (response.status === 200 && response.data.success) {
        return response.data.data;
      } else {
        // 處理 API 返回非成功的情況
        console.error('API returned error:', response.data);
        throw new Error(response.data.message || 'Failed to fetch detail types');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // 重新拋出錯誤以便調用者能處理
      throw error;
    }
    return [];
  },
    async queryAudit(data: AuditQuery){
      try {
        const response = await api.post('/Audit/Query', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // 確保響應數據結構符合 AuditQueryResponse 格式
    // 檢查API返回的數據結構並進行轉換
    if (response.data && response.data.data) {
      // 檢查是否存在嵌套的結構
      const basicsData = Array.isArray(response.data.data[0])
        ? response.data.data[0]
        : (response.data.data[0]?.basics || []);

      const suggestsData = Array.isArray(response.data.data[1])
        ? response.data.data[1]
        : (response.data.data[1]?.suggests || []);

      console.log('轉換後的數據結構:', { basics: basicsData, suggests: suggestsData });

      return {
        basics: basicsData,
        suggests: suggestsData
      };
    }

    // 如果沒有數據或者格式不符，返回空陣列
    return { basics: [], suggests: [] };
      } catch (error) {
        console.error('查詢審核資料時發生錯誤:', error);
        throw error;
      }
    },
  async GetOrginfo(id: string|undefined){
    return true
  },
  VerificationEmailwithUrl(data:AuditeditVerification){
    console.log(data)
    return {
      success: true,
      data: {
        UserId:"A524B6ED-4E6F-4703-A135-E806CDFCE7CE",
        UserName: "黃仲儀",
        Unit: "中油股份有限公司",
        Position: "組處",

      }
    }
  },
  async getBasicInfoByUserId(userId: string): Promise<ApiResponse<AuditEditResult[]>> {
    try {
      const response = await axios.post("http://localhost:5238/Audit/GetBasicInfoByUserId", {
        userId: userId
      }, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "*/*"
        }
      });

      if (response.status === 200) {
        return response.data as ApiResponse<AuditEditResult[]>;
      } else {
        return {
          success: false,
          message: "查詢基本資料失敗，伺服器回應異常",
          data: []
        };
      }
    } catch (error) {
      console.error("查詢基本資料失敗", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "查詢基本資料失敗",
        data: []
      };
    }
  },
  async GetAuditInfoSuggest(uuid: string): Promise<ApiResponse<AuditInfoSuggest[]>> {
  try {
      const response = await axios.post("http://localhost:5238/Audit/GetAuditInfoSuggest", {
        Uuid: uuid
      }, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "*/*"
        }
      });

      if (response.status === 200) {
        return response.data as ApiResponse<AuditInfoSuggest[]>;
      } else {
        return {
          success: false,
          message: "查詢基本資料失敗，伺服器回應異常",
          data: []
        };
      }
    } catch (error) {
      console.error("查詢基本資料失敗", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "查詢基本資料失敗",
        data: []
      };
    }
  },

};
