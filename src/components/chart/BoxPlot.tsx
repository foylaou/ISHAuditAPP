"use client";
import React, { useEffect, useState } from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";
import { useGlobalStore } from "@/store/useGlobalStore";

// 固定數據，避免每次渲染時重新創建
const chartData = [
  { department: "Sales", min: 1052, q1: 4465, median: 5765, q3: 8834, max: 14852 },
  { department: "R&D", min: 1009, q1: 2741, median: 4377, q3: 7725, max: 14814 },
  { department: "HR", min: 1555, q1: 2696, median: 4071, q3: 9756, max: 19717 },
];

// 產生 AgChartOptions 設定
const getOptions = (isdarkmode: boolean): AgChartOptions => ({
  title: { text: "示範Box Plot" },
  subtitle: { text: "測試用示範Box Plot" },
  theme: isdarkmode ? "ag-default-dark" : "ag-default",
  data: chartData,
  series: [
    {
      type: "box-plot",
      yName: "Employee Salaries",
      xKey: "department",
      minKey: "min",
      q1Key: "q1",
      medianKey: "median",
      q3Key: "q3",
      maxKey: "max",
    },
  ],
});

export default function BoxPlotExample() {
  const isdarkmode = useGlobalStore((state) => state.theme);
  const [option, setOption] = useState<AgChartOptions>(getOptions(isdarkmode));

  // 監聽 isdarkmode 變化並更新圖表設定
  useEffect(() => {
    setOption(getOptions(isdarkmode));
  }, [isdarkmode]);

  return <AgCharts options={option} />;
}
