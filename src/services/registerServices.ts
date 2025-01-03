import axios from 'axios';
import { RegisterForm, RegisterApiRequest } from "@/types/registerType";

const api = axios.create({
  baseURL: '/proxy'
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/register';
    }
    return Promise.reject(error);
  }
);

export const registerServices = {
  async register(formData: RegisterForm) {
    // 直接轉換成 API 需要的格式
    const apiData: RegisterApiRequest = {
      Username: formData.username,
      Password: formData.password,
      Nickname: formData.name,  // 從 name 映射到 nickname
      Audit: formData.auditRole,
      KPI: formData.kpiRole,
      Sys: formData.sysRole,
      Org: formData.orgRole,
      EnterpriseId: parseInt(formData.enterpriseId),
      CompanyId: parseInt(formData.companyId),
      FactoryId: parseInt(formData.factoryId)
    };

    try {
      const response = await api.post('/register', apiData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          throw error;
        }
        // 處理 404 錯誤
        if (error.response?.status === 404) {
          throw new Error('資源未找到，請檢查 API 路徑或請求參數');
        }

        // 處理其他錯誤
        const errorMessage =
          error.response?.data?.message ||
          `HTTP 錯誤，狀態碼: ${error.response?.status}`;
        throw new Error(errorMessage);
      } else {
        // 非 Axios 錯誤
        throw new Error('未知錯誤，請稍後再試');
      }
    }
  },
};
