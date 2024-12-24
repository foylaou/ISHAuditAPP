// types/registerType.ts
export interface RegisterForm {
  username: string;
  password: string;
  name: string;
  enterpriseId: string;
  companyId: string;
  factoryId: string;
  auditRole: string;
  kpiRole: string;
  sysRole: string;
  orgRole: string;
}

export interface RegisterApiRequest {
  Username: string;
  Password: string;
  Nickname: string;
  Audit: string;
  KPI: string;
  Sys: string;
  Org: string;
  EnterpriseId: number;
  CompanyId: number;
  FactoryId: number;
}
