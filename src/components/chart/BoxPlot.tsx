"use client"
import React, {useEffect, useState} from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-enterprise";
import "ag-charts-enterprise";
import {useGlobalStore} from "@/store/useGlobalStore";
import {AllCommunityModule, LicenseManager, ModuleRegistry} from "ag-grid-enterprise";
ModuleRegistry.registerModules([AllCommunityModule]);
// 固定數據，避免每次渲染時重新創建
const chartData = [
  { department: "Sales", min: 1052, q1: 4465, median: 5765, q3: 8834, max: 14852 },
  { department: "R&D", min: 1009, q1: 2741, median: 4377, q3: 7725, max: 14814 },
  { department: "HR", min: 1555, q1: 2696, median: 4071, q3: 9756, max: 19717 },
];

// 產生 AgChartOptions 設定
const getOptions = (isdarkmode: boolean): AgChartOptions => ({
  title: {
    text: "部門薪資分布 (箱型圖)",
    fontSize: 18,
  },
  subtitle: { text: "薪資分布情況", fontSize: 14 },
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

export default function BoxPlotExample() {
  const isdarkmode = useGlobalStore((state) => state.theme);
  const [option, setOption] = useState<AgChartOptions>(getOptions(isdarkmode));
  LicenseManager.setLicenseKey("Using_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-067721}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Industrial_Safety_And_Health_Association_(ISHA)_Of_The_R.O.C}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{}_only_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_{}_need_to_be_licensed___{}_has_been_granted_a_Deployment_License_Add-on_for_{1}_Production_Environment___This_key_works_with_{AG_Charts_and_AG_Grid}_Enterprise_versions_released_before_{27_October_2025}____[v3]_[0102]_MTc2MTUyMzIwMDAwMA==14fa603063a97c2c3a7a73a15786443e");  const { theme } = useGlobalStore();

  useEffect(() => {
    setOption(getOptions(isdarkmode));
  }, [isdarkmode]);

  return (
    <div>
      {/* 確保讀屏器可以讀取 */}
      <div role="img" aria-label="各部門薪資分布的箱型圖">
        <AgCharts options={option} />
      </div>

      {/* 提供額外的數據表格 */}
      <table style={{ marginTop: "20px", border: "1px solid #ccc", width: "100%" }}>
        <caption>部門薪資統計數據表</caption>
        <thead>
          <tr>
            <th>部門</th>
            <th>最小值 (USD)</th>
            <th>第一四分位 (USD)</th>
            <th>中位數 (USD)</th>
            <th>第三四分位 (USD)</th>
            <th>最大值 (USD)</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map((item) => (
            <tr key={item.department}>
              <td>{item.department}</td>
              <td>{item.min.toLocaleString()}</td>
              <td>{item.q1.toLocaleString()}</td>
              <td>{item.median.toLocaleString()}</td>
              <td>{item.q3.toLocaleString()}</td>
              <td>{item.max.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
