export interface MenuItem {
  label: string;
  link?: string;
  children?: MenuItem[];
  auth?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}
