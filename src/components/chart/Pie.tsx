'use client'
import React, { useMemo } from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-enterprise";
import { useGlobalStore } from "@/store/useGlobalStore";
import "ag-charts-enterprise";
import {AllCommunityModule, ModuleRegistry} from "ag-grid-enterprise";
ModuleRegistry.registerModules([AllCommunityModule]);
function getData() {
  return [
    { asset: "Stocks", amount: 60000 },
    { asset: "Bonds", amount: 40000 },
    { asset: "Cash", amount: 7000 },
    { asset: "Real Estate", amount: 5000 },
    { asset: "Commodities", amount: 3000 },
  ];
}

export default function PieExample() {
  const data = getData();
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const isdarkmode = useGlobalStore().theme;


  const options: AgChartOptions = useMemo(() => ({
    theme: isdarkmode ? "ag-default-dark" : "ag-default",
    data: data,
    title: { text: "示範圓餅圖", fontSize: 18 },
    series: [
      {
        type: "pie",
        angleKey: "amount",
        labelKey: "asset",
        innerRadiusRatio: 0.6,
        ensureDomOrder: true,
        sectorLabel: {
          enabled: true,
          formatter: ({ datum }) => {
            const percentage = ((datum.amount / totalAmount) * 100).toFixed(1);
            return `${datum.asset}: ${percentage}%`;
          },
        },
        fills: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"], // 高對比顏色
        strokes: ["#000", "#000", "#000", "#000", "#000"], // 讓邊界清晰
      },
    ],
    legend: {
      position: "right",
      enabled: true,
      item: {
        label: {
          fontSize: 14,
          color: isdarkmode ? "#ffffff" : "#000000", // 讓文字在深色或淺色模式下都清晰可讀
        },
      },
    },
    accessibility: {
      enabled: true, // 啟用無障礙模式
      description: "此圖表顯示不同資產類別的資金分配比例。",
    },
  }), [data, totalAmount]);

  return (
    <div>
      <AgCharts options={options} />
      <table style={{ marginTop: "20px", border: "1px solid #ccc", width: "100%" }}>
        <caption>資產分配數據</caption>
        <thead>
          <tr>
            <th>資產類別</th>
            <th>金額 (美元)</th>
            <th>比例 (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.asset}>
              <td>{item.asset}</td>
              <td>{item.amount.toLocaleString()}</td>
              <td>{((item.amount / totalAmount) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
