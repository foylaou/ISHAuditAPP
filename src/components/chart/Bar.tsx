"use client";
import React, { useState, useEffect } from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-enterprise";
import { useGlobalStore } from "@/store/useGlobalStore";
import "ag-charts-enterprise";
import {AllCommunityModule, ModuleRegistry} from "ag-grid-enterprise";
ModuleRegistry.registerModules([AllCommunityModule]);
// 測試數據
const getData = () => [
  { quarter: "Q1'18", iphone: 140, mac: 16, ipad: 14, wearables: 12, services: 20 },
  { quarter: "Q2'18", iphone: 124, mac: 20, ipad: 14, wearables: 12, services: 30 },
  { quarter: "Q3'18", iphone: 112, mac: 20, ipad: 18, wearables: 14, services: 36 },
  { quarter: "Q4'18", iphone: 118, mac: 24, ipad: 14, wearables: 14, services: 36 },
];

// 產生 AgChartOptions 的函式
const getOptions = (isdarkmode: boolean): AgChartOptions => ({
  title: {
    text: "Apple 銷售數據 (季度)",
    fontSize: 18,
  },
  subtitle: { text: "各產品在不同季度的銷售表現", fontSize: 14 },
  theme: isdarkmode ? "ag-default-dark" : "ag-default",
  data: getData(),
  series: [
    { type: "bar", xKey: "quarter", yKey: "iphone", yName: "iPhone", fill: "#1f77b4", stroke: "#000", label: { enabled: true, fontSize: 12 } },
    { type: "bar", xKey: "quarter", yKey: "mac", yName: "Mac", fill: "#ff7f0e", stroke: "#000", label: { enabled: true, fontSize: 12 } },
    { type: "bar", xKey: "quarter", yKey: "ipad", yName: "iPad", fill: "#2ca02c", stroke: "#000", label: { enabled: true, fontSize: 12 } },
    { type: "bar", xKey: "quarter", yKey: "wearables", yName: "Wearables", fill: "#d62728", stroke: "#000", label: { enabled: true, fontSize: 12 } },
    { type: "bar", xKey: "quarter", yKey: "services", yName: "Services", fill: "#9467bd", stroke: "#000", label: { enabled: true, fontSize: 12 } },
  ],
  legend: {
    position: "right",
    enabled: true,
    item: {
      label: {
        color: isdarkmode ? "#ffffff" : "#000000",
      },
    },
  },
});

export default function BarExample() {
  const isdarkmode = useGlobalStore((state) => state.theme);
  const [option, setOption] = useState<AgChartOptions>(getOptions(isdarkmode));

  useEffect(() => {
    setOption(getOptions(isdarkmode));
  }, [isdarkmode]);

  return (
    <div>
      {/* 確保讀屏器能讀取圖表內容 */}
      <div role="img" aria-label="Apple 產品季度銷售數據條形圖">
        <AgCharts options={option} />
      </div>

      {/* 提供對應的數據表格 */}
      <table style={{ marginTop: "20px", border: "1px solid #ccc", width: "100%" }}>
        <caption>Apple 產品銷售數據表</caption>
        <thead>
          <tr>
            <th>季度</th>
            <th>iPhone (百萬台)</th>
            <th>Mac (百萬台)</th>
            <th>iPad (百萬台)</th>
            <th>穿戴設備 (百萬台)</th>
            <th>服務收入 (億美元)</th>
          </tr>
        </thead>
        <tbody>
          {getData().map((item) => (
            <tr key={item.quarter}>
              <td>{item.quarter}</td>
              <td>{item.iphone}</td>
              <td>{item.mac}</td>
              <td>{item.ipad}</td>
              <td>{item.wearables}</td>
              <td>{item.services}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
