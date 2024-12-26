// types/auditType.ts
export interface AuditQueryForm {
    citiesId:string,
    townshipsId:string,
    industrialAreasId:string,
    AuditTypeId:string,
    AuditCauseId:string,
    AuditItemsId:string,
    AuditDate:string,
    enterpriseId: string,
    companyId: string,
    factoryId: string,
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

