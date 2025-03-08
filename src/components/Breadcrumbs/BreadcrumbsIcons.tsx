import React, { useState, useEffect } from 'react';
import * as Icons from "lucide-react";
import { LucideIcon } from 'lucide-react';
import { useMenuStore } from "@/store/menuStore";
import { usePathname } from 'next/navigation';
import {MenuItem} from "@/types/menuTypes";

// 定義麵包屑項目的介面
interface BreadcrumbItem {
  icon: keyof typeof Icons;
  name: string;
  link?: string;
  children?: BreadcrumbItem[];
}


// 定義組件的 props
interface BreadcrumbsIconsProps {
  className?: string;
  items?: BreadcrumbItem[];
}

// 定義圖標映射，將菜單項的標籤映射到 Lucide 圖標
const iconMapping: Record<string, keyof typeof Icons> = {
  '首頁': 'Home',
  '督導查詢': 'Search',
  '系統管理': 'Settings',
  '新增帳號': 'UserPlus',
  '測試123': 'TestTube',
};

// 獲取默認圖標
const getIconForLabel = (label: string): keyof typeof Icons => {
  return iconMapping[label] || 'File';
};

export default function BreadcrumbsIcons(props: BreadcrumbsIconsProps) {
  const { className = '' } = props;
  const pathname = usePathname(); // 獲取當前路徑

  // 定義狀態來存儲麵包屑項目
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);
  const { menuItems, fetchMenuItems } = useMenuStore();

  // 獲取菜單項目
  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  // 基於當前路徑和菜單項目生成麵包屑
  useEffect(() => {
    // 如果提供了自定義項目，優先使用
    if (props.items && props.items.length > 0) {
      setBreadcrumbItems(props.items);
      return;
    }

    // 確保有菜單項目
    if (!menuItems || menuItems.length === 0) {
      setBreadcrumbItems([
        {
          icon: "Home",
          name: "首頁",
          link: "/"
        }
      ]);
      return;
    }

    // 尋找匹配當前路徑的菜單項
    const buildBreadcrumbs = (): BreadcrumbItem[] => {
      // 首先添加首頁
      const breadcrumbs: BreadcrumbItem[] = [
        {
          icon: "Home",
          name: "首頁",
          link: "/Home"
        }
      ];

      // 如果是首頁路徑，只返回首頁麵包屑
      if (pathname === "/Home" || pathname === "/") {
        return breadcrumbs;
      }

      // 查找匹配的菜單項和父項
      const findMatchingItem = (
        items: MenuItem[],
        path: string,
        parentItems: MenuItem[] = []
      ): { found: boolean; breadcrumbs: BreadcrumbItem[] } => {
        for (const item of items) {
          // 檢查當前項是否匹配路徑
          if (item.link && path.startsWith(item.link)) {
            // 添加所有父項
            const result: BreadcrumbItem[] = [];
            for (const parent of parentItems) {
              result.push({
                icon: getIconForLabel(parent.label),
                name: parent.label,
                link: parent.link || "#"
              });
            }

            // 添加當前項
            result.push({
              icon: getIconForLabel(item.label),
              name: item.label,
              link: item.link
            });

            return { found: true, breadcrumbs: result };
          }

          // 如果有子項，遞歸檢查
          if (item.children && item.children.length > 0) {
            const result = findMatchingItem(
              item.children,
              path,
              [...parentItems, item]
            );
            if (result.found) {
              return result;
            }
          }
        }

        return { found: false, breadcrumbs: [] };
      };

      const result = findMatchingItem(menuItems, pathname);
      if (result.found && result.breadcrumbs.length > 0) {
        return [...breadcrumbs, ...result.breadcrumbs];
      }

      // 如果沒有找到匹配，返回默認麵包屑
      return breadcrumbs;
    };

    const newBreadcrumbs = buildBreadcrumbs();
    setBreadcrumbItems(newBreadcrumbs);
  }, [props.items, menuItems, pathname]);

  // 渲染單個麵包屑項目的函數
  function renderBreadcrumbItem(
    item: BreadcrumbItem,
    index: number,
    isLast: boolean
  ): React.ReactElement {

    
    const IconComponent = (Icons[item.icon] as LucideIcon) || Icons.File;

    // 創建內容元素
    const content = (
      <span className="inline-flex items-center gap-2">
        <IconComponent className="h-4 w-4 stroke-current" />
        {item.name}
      </span>
    );

    // 最後一個項目不顯示為連結
    if (isLast) {
      return (
        <li key={index}>
          {content}
        </li>
      );
    }

    // 有連結的項目顯示為連結
    return (
      <li key={index}>
        <a href={item.link || "#"}>
          {content}
        </a>
      </li>
    );
  }

  // 組件主體渲染
  return (
    <div className={`breadcrumbs text-sm text-base-content ${className}`}>
      <ul>
        {breadcrumbItems.map((item, index) =>
          renderBreadcrumbItem(item, index, index === breadcrumbItems.length - 1)
        )}
      </ul>
    </div>
  );
}
