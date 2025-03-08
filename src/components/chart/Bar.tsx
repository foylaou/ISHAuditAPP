"use client";
import React, { useState, useEffect } from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";
import { useGlobalStore } from "@/store/useGlobalStore";

// 取得測試數據
const getData = () => {
  return [
    { quarter: "Q1'18", iphone: 140, mac: 16, ipad: 14, wearables: 12, services: 20 },
    { quarter: "Q2'18", iphone: 124, mac: 20, ipad: 14, wearables: 12, services: 30 },
    { quarter: "Q3'18", iphone: 112, mac: 20, ipad: 18, wearables: 14, services: 36 },
    { quarter: "Q4'18", iphone: 118, mac: 24, ipad: 14, wearables: 14, services: 36 },
  ];
};

// 產生 AgChartOptions 的函式
const getOptions = (isdarkmode: boolean): AgChartOptions => ({
  title: { text: "示範Bar" },
  subtitle: { text: "測試用示範Bar" },
  theme: isdarkmode ? "ag-default-dark" : "ag-default",
  data: getData(),
  series: [
    { type: "bar", xKey: "quarter", yKey: "iphone", yName: "iPhone" },
    { type: "bar", xKey: "quarter", yKey: "mac", yName: "Mac" },
    { type: "bar", xKey: "quarter", yKey: "ipad", yName: "iPad" },
    { type: "bar", xKey: "quarter", yKey: "wearables", yName: "Wearables" },
    { type: "bar", xKey: "quarter", yKey: "services", yName: "Services" },
  ],
});

export default function BarExample() {
  const isdarkmode = useGlobalStore((state) => state.theme); // 避免整個 store 變化時重新渲染
  const [option, setOption] = useState<AgChartOptions>(getOptions(isdarkmode));

  // 監聽 isdarkmode 變化並更新圖表設定
  useEffect(() => {
    setOption(getOptions(isdarkmode));
  }, [isdarkmode]);

  return <AgCharts options={option} />;
}
