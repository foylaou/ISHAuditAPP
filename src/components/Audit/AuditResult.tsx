import React, {StrictMode, useMemo, useState} from "react";
import {
  ColDef,
  colorSchemeDarkBlue,
  colorSchemeLightWarm,
  ICellRendererParams,
  StatusPanelDef,
  themeQuartz
} from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry  } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useGlobalStore } from '@/store/useGlobalStore';
import { AG_GRID_LOCALE_TW } from '@ag-grid-community/locale';
import {useAuditStore} from "@/store/useAuditStore";
import {AuditBasicResult} from "@/types/AuditQuery/auditQuery";
import {ROCformatDateTools} from "@/utils/Timetool";
import {Button} from "@mantine/core";
import {useRouter} from "next/navigation";

// 如果使用 React Router，則使用：import { useNavigate } from 'react-router-dom';

ModuleRegistry.registerModules([AllCommunityModule]);

const themeLightWarm = themeQuartz.withPart(colorSchemeLightWarm);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

const BasicGrid = ({ onRowSelected }: { onRowSelected: (data: AuditBasicResult | null) => void }) => {
  // 使用全域狀態的布林值主題
  const BasicData = useAuditStore(state => state.auditData?.basics);
  // theme 為 true 時表示暗色模式
  const isDarkMode = useGlobalStore().theme;

  // 處理行點擊事件 - 只選中行，不跳轉
  const handleRowClick = (params: { data: AuditBasicResult }) => {
    onRowSelected(params.data);
  };

  const [colDefs] = useState<ColDef<AuditBasicResult>[]>([
    { field: "industrialArea", headerName: "工業區" },
    { field: "company", headerName: "公司" },
    { field: "factory", headerName: "工廠" },
    { field: "auditType", headerName: "督導種類" },
    { field: "disaterTypes", headerName: "災害類型" },
    {
      field: "incidentDatetime",
      headerName: "事故時間",
      cellRenderer: (params: ICellRendererParams<AuditBasicResult>) =>
        params.value ? ROCformatDateTools.formatDate(params.value) : '',
    },
    {
      field: "auditStartDate",
      headerName: "督導時間",
      cellRenderer: (params: ICellRendererParams<AuditBasicResult>) =>
        params.value ? ROCformatDateTools.formatDate(params.value) : '',
    },
    {
      field: "sd",
      headerName: "停工？",
      cellRenderer: (params: ICellRendererParams<AuditBasicResult>) =>
        params.value ==='Y' ? (
          <span className="text-accent">是</span>
        ) : (
          <span className="text-primary">否</span>
        ),
    },
    {
      field: "penalty",
      headerName: "裁罰？",
      cellRenderer: (params: ICellRendererParams<AuditBasicResult>) =>
        params.value ==="Y" ? (
          <span className="text-accent">是</span>
        ) : (
          <span className="text-primary">否</span>
        ),
    },
  ]);

  const defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    resizable: true,
  };

  const statusBar = useMemo<{
    statusPanels: StatusPanelDef[];
  }>(() => {
    return {
      statusPanels: [
        { statusPanel: "agTotalAndFilteredRowCountComponent" },
        { statusPanel: "agTotalRowCountComponent" },
        { statusPanel: "agFilteredRowCountComponent" },
        { statusPanel: "agSelectedRowCountComponent" },
        { statusPanel: "agAggregationComponent" },
      ],
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "700px",
        marginTop: "20px",
        zIndex: 1,
      }}
    >
      <AgGridReact
        localeText={AG_GRID_LOCALE_TW}
        rowStyle={{ overflow: 'visible', cursor: 'pointer' }} // 添加指針游標
        suppressRowTransform={true}
        rowData={BasicData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        pagination={true}
        sideBar={true}
        statusBar={statusBar}
        paginationPageSize={20}
        theme={isDarkMode ? themeDarkBlue : themeLightWarm}
        onRowClicked={handleRowClick} // 點擊行時保存選中的行
        rowSelection="single" // 啟用單行選擇
      />
    </div>
  );
};

export default function BasicResult() {
  const router = useRouter();
  // 如果使用 React Router，則使用：const navigate = useNavigate();

  // 保存選中的行數據
  const [selectedRow, setSelectedRow] = useState<AuditBasicResult | null>(null);

  // 處理查詢按鈕點擊
  const handleQuery = () => {
    if (selectedRow && selectedRow.uuid) {
      router.push(`/Audit/Auditinfo/${selectedRow.uuid}`);
      // 如果使用 React Router，則使用：navigate(`/AuditInfo/${selectedRow.uuid}`);
    } else {
      // 可能的錯誤處理，如顯示提示"請先選擇一行數據"
      alert("請先選擇一筆資料");
    }
  };

  return (
    <StrictMode>
      <div className="w-full">
        <h2 className="text-xl text-base-content mb-4">稽核結果</h2>
        <BasicGrid onRowSelected={setSelectedRow} />
      </div>
      <div className="flex justify-end mt-4">
        <Button
          className="btn btn-primary btn-lg"
          onClick={handleQuery}
          disabled={!selectedRow} // 如果沒有選中行，禁用按鈕
        >
          查詢
        </Button>
      </div>
    </StrictMode>
  );
}
