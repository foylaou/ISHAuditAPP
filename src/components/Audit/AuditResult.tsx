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
ModuleRegistry.registerModules([AllCommunityModule]);

interface IRow {
  factory_area: string;
  company_name: string;
  factory_name: string;
  supervisionType: string;
  disasterType: string;
  incidentTime: string;
  supervisionTime: string;
  stopWork: boolean;
  penalty: boolean;
}

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

const themeLightWarm = themeQuartz.withPart(colorSchemeLightWarm);

const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);



const GridExample = () => {
  // 使用全域狀態的布林值主題

  // theme 為 true 時表示暗色模式
  const isDarkMode = useGlobalStore().theme;

  const [rowData] = useState<IRow[]>([
    {
      factory_area: "南部科學園區",
      company_name: "台灣石化公司",
      factory_name: "A廠",
      supervisionType: "安全督導",
      disasterType: "火災",
      incidentTime: "2024-12-10T14:30:00Z",
      supervisionTime: "2024-12-11T09:00:00Z",
      stopWork: true,
      penalty: false,
    },
    {
      factory_area: "中部工業區",
      company_name: "中油公司",
      factory_name: "B廠",
      supervisionType: "例行督導",
      disasterType: "無",
      incidentTime: "2024-11-01T09:00:00Z",
      supervisionTime: "2024-11-02T10:00:00Z",
      stopWork: false,
      penalty: true,
    },
    {
      factory_area: "北部工業區",
      company_name: "電子科技公司",
      factory_name: "C廠",
      supervisionType: "災害檢查",
      disasterType: "氣爆",
      incidentTime: "2024-10-20T15:45:00Z",
      supervisionTime: "2024-10-21T08:00:00Z",
      stopWork: true,
      penalty: true,
    },
  ]);

  const [colDefs] = useState<ColDef<IRow>[]>([
    { field: "factory_area", headerName: "工業區" },
    { field: "company_name", headerName: "公司" },
    { field: "factory_name", headerName: "工廠" },
    { field: "supervisionType", headerName: "督導種類" },
    { field: "disasterType", headerName: "災害類型" },
    {
      field: "incidentTime",
      headerName: "事故時間",
      cellRenderer: (params: ICellRendererParams<IRow, string>) =>
        params.value ? formatDateTime(params.value) : '',
    },
    {
      field: "supervisionTime",
      headerName: "督導時間",
      cellRenderer: (params: ICellRendererParams<IRow, string>) =>
        params.value ? formatDateTime(params.value) : '',
    },
    {
      field: "stopWork",
      headerName: "停工？",
      cellRenderer: (params: ICellRendererParams<IRow, boolean>) =>
        params.value ? (
          <span className="text-error">是</span>
        ) : (
          <span className="text-success">否</span>
        ),
    },
    {
      field: "penalty",
      headerName: "裁罰？",
      cellRenderer: (params: ICellRendererParams<IRow, boolean>) =>
        params.value ? (
          <span className="text-error">是</span>
        ) : (
          <span className="text-success">否</span>
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
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        pagination={true}
        sideBar={true}
        statusBar={statusBar}
        paginationPageSize={10}
        theme={isDarkMode ? themeDarkBlue : themeLightWarm}

      />
    </div>
  );
};

export default function auditResult() {
  return (
    <StrictMode>
      <div className="w-full">
        <h2 className="text-xl text-base-content mb-4">稽核結果</h2>
        <GridExample />
      </div>
    </StrictMode>
  );
}
