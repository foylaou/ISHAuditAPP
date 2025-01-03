// types/menuTypes.ts
export type ModuleType = 'Audit' | 'KPI' | 'Sys' | 'Org';
export type PermissionLevel = 'Admin' | 'Power' | 'Edit' | 'None';

export interface ModulePermission {
  module: ModuleType;
  level: PermissionLevel;
}

export interface MenuItem {
  label: string;
  link?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children?: MenuItem[];
  permission?: ModulePermission | ModulePermission[];
}
