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
import {formatDate} from "@/utils/Timetool";
ModuleRegistry.registerModules([AllCommunityModule]);

const themeLightWarm = themeQuartz.withPart(colorSchemeLightWarm);

const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);



const BasicGrid = () => {
  // 使用全域狀態的布林值主題
  const BasicData = useAuditStore(state => state.auditData?.basics);

  // theme 為 true 時表示暗色模式
  const isDarkMode = useGlobalStore().theme;



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
        params.value ? formatDate(params.value) : '',
    },
    {
      field: "auditStartDate",
      headerName: "督導時間",
      cellRenderer: (params: ICellRendererParams<AuditBasicResult>) =>
        params.value ? formatDate(params.value) : '',
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
        rowStyle={{ overflow: 'visible' }}
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

      />
    </div>
  );
};

export default function BasicResult() {
  return (
    <StrictMode>
      <div className="w-full">
        <h2 className="text-xl text-base-content mb-4">稽核結果</h2>
        <BasicGrid />
      </div>
    </StrictMode>
  );
}
