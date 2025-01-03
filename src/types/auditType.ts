// types/auditType.ts
export interface AuditQueryForm {
    cityInfoId: "",
    townshipsId: "",
    industrialareasId: "",
    AuditTypeId:string,
    AuditCauseId:string,
    AuditItemsId:string,
    AuditDate:string,
    enterpriseId: string,
    companyId: string,
    factoryId: string,
    suggestcategoryId: "",
    suggesttypeId: "",
    suggestitemId: "",

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

