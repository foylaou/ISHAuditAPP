// 修改 AuditeditBasicInfo.tsx 文件

import {useGlobalStore} from "@/store/useGlobalStore";
import {AuditBasicResult} from "@/types/AuditQuery/auditQuery";
import React, {useMemo, useState, useEffect} from "react";
import {
    ColDef,
    colorSchemeDarkBlue,
    colorSchemeLightWarm,
    ICellRendererParams,
    StatusPanelDef,
    themeQuartz,
    GridReadyEvent,
    GridApi
} from "ag-grid-community";
import {ROCformatDateTools} from "@/utils/Timetool";
import {AgGridReact} from "ag-grid-react";
import {AG_GRID_LOCALE_TW} from "@ag-grid-community/locale";
import {useStepContext} from "@/components/Steps/StepComponse";

interface AuditeditBasicInfoProps {
    UserId?: string;
    onRowSelected: (data: AuditBasicResult | null) => void;
    basicInfoData?: AuditBasicResult[]; // 添加這項以接收資料
}

const themeLightWarm = themeQuartz.withPart(colorSchemeLightWarm);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

export interface AuditEditResult {
  uuid: string;
  factory: string | null;
  auditType:string| null;
  auditStartDate: string| null;
  adoptionRate:string | null;
  improvementCompletionRate:string | null;
}

// 自定義的完成狀態單元格渲染器
const CompletedStatusCellRenderer = (props: ICellRendererParams) => {
    const { stepData } = useStepContext();
    const completedAuditIds = stepData.completedAuditIds as Set<string> || new Set<string>();

    // 檢查該行是否已完成填報 (使用uuid作為識別)
    const rowUuid = props.data.uuid;
    const isCompleted = completedAuditIds.has(rowUuid);

    return (
        <div className="flex justify-center items-center h-full">
            {isCompleted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <span>待完成</span>
            )}
        </div>
    );
};

export default function AuditeditBasicInfo(props: AuditeditBasicInfoProps) {
    // theme 為 true 時表示暗色模式
    const isDarkMode = useGlobalStore().theme;
    const { stepData, updateStepData } = useStepContext();
    const [gridApi, setGridApi] = useState<GridApi | null>(null);

    // Get the audit data from either props or stepData, ensuring it's an array
    const auditData = props.basicInfoData ||
                      (Array.isArray(stepData.BasicInfo) ? stepData.BasicInfo :
                       (stepData.BasicInfo ? [stepData.BasicInfo] : []));

    // 初始化完成狀態集合（如果不存在）
    useEffect(() => {
        if (!stepData.completedAuditIds) {
            updateStepData({
                completedAuditIds: new Set<string>()
            });
        }
    }, [stepData, updateStepData]);

    // 處理行點擊事件 - 只選中行，不跳轉
    const handleRowClick = (params: { data: AuditBasicResult }) => {
        // 正確呼叫從 props 傳入的 onRowSelected 函數
        props.onRowSelected(params.data);

        // 更新 stepData 以儲存所選行的數據
        updateStepData({
            selectedAuditBasic: params.data
        });
    };

    // 處理網格準備好時的事件
    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params.api);
    };

    // 當completedAuditIds變化時重新繪製網格
    useEffect(() => {
        if (gridApi) {
            gridApi.refreshCells({ force: true });
        }
    }, [stepData.completedAuditIds, gridApi]);

    const [colDefs] = useState<ColDef[]>([
        {field: "uuid", headerName: "Uuid", hide: true},
        { field: "factory", headerName: "工廠" },
        { field: "auditType", headerName: "督導種類" },
        {
            field: "auditStartDate",
            headerName: "督導時間",
            cellRenderer: (params: ICellRendererParams) =>
                params.value ? ROCformatDateTools.formatDate(params.value) : '',
        },
        {
            field: "adoptionRate",
            headerName: "參採率(%)",
            cellRenderer: (params: ICellRendererParams) =>
                params.value ? params.value+"%" : '',
        },
        {
            field: "improvementCompletionRate",
            headerName:"改善完成率(%)",
            cellRenderer: (params: ICellRendererParams) =>
                params.value ? params.value+"%" : '',
        },
        {
            headerName: "完成填報",
            cellRenderer: CompletedStatusCellRenderer,
            width: 120,
            flex: 0.7,
            cellStyle: { textAlign: 'center' }
        }
    ]);

    const defaultColDef: ColDef = {
        flex: 1,
        sortable: false,
        filter: false,
        resizable: false,
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
        <>
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
                    rowStyle={{overflow: 'visible', cursor: 'pointer'}} // 添加指針游標
                    suppressRowTransform={true}
                    rowData={auditData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    animateRows={false}
                    pagination={false}
                    sideBar={false}
                    statusBar={statusBar}
                    paginationPageSize={20}
                    theme={isDarkMode ? themeDarkBlue : themeLightWarm}
                    onRowClicked={handleRowClick}
                    rowSelection="single"
                    onGridReady={onGridReady}
                />
            </div>
        </>
    )
}
