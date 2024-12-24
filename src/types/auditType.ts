// types/auditType.ts
export interface AuditQueryForm {
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

export interface AuditQueryRequest {
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

