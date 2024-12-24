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
      throw error;
    }
  }
};
