// types/menuTypes.ts
export interface ModulePermission {
  module: 'Audit' | 'KPI' | 'Sys' | 'Org';
  level: 'admin' | 'manager' | 'user';
}

export interface MenuItem {
  label: string;
  link?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children?: MenuItem[];
  permission?: ModulePermission | ModulePermission[];
}
