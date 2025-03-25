import React, {JSX, StrictMode, useState, useEffect, useCallback, useRef} from "react";
import {ColDef, colorSchemeDarkBlue, colorSchemeLightWarm, themeQuartz} from "ag-grid-enterprise";
import {AllCommunityModule, ModuleRegistry} from "ag-grid-enterprise";
import {AgGridReact} from "ag-grid-react";
import {useGlobalStore} from '@/store/useGlobalStore';
import { AG_GRID_LOCALE_TW } from '@ag-grid-community/locale';
import {auditQueryService} from "@/services/Audit/auditQueryService";
import {AuditInfoSuggest} from "@/components/Auditedit/AuditInfoSuggest";
import {ICellRendererParams} from "ag-grid-community";
import {ROCformatDateTools} from "@/utils/Timetool";


ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightWarm = themeQuartz.withPart(colorSchemeLightWarm);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);


interface AuditSuggestInfoProps {
    id: string;
}


export default function SuggestResult(props: AuditSuggestInfoProps): JSX.Element {
    const [filterText, setFilterText] = useState<string>('');
    const gridRef = useRef<AgGridReact>(null);
    const [isFilterActive, setIsFilterActive] = useState(false); // 用來記錄目前是否套用了篩選
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(e.target.value);
    };

    // 篩選：參採且未完成改善
const toggleFilterAdoptedNotCompleted = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
        try {
            if (isFilterActive) {
                // 🔄 若已套用篩選 -> 取消篩選
                gridRef.current.api.setFilterModel({});
                gridRef.current.api.onFilterChanged();
                console.log('🔄 取消篩選');
                setIsFilterActive(false);
            } else {
                // ✅ 套用篩選
                const filterModel = {
                    isAdopted: {
                        filterType: 'set',
                        values: ['true'],
                    },
                    isImprovementCompleted: {
                        filterType: 'set',
                        values: ['false'],
                    }
                };
                gridRef.current.api.setFilterModel(filterModel);
                gridRef.current.api.onFilterChanged();
                console.log('✅ 套用篩選: 參採=是, 未完成改善=否');
                setIsFilterActive(true);
            }
        } catch (error) {
            console.error('❌ 套用或取消篩選時發生錯誤:', error);
        }
    }
}, [isFilterActive, setIsFilterActive]);
    const SuggestGrid = () => {
        // 使用全域狀態的布林值主題
        const {theme} = useGlobalStore();
        // rowData state for grid
        const [suggestData, setSuggestData] = useState<AuditInfoSuggest[]>([]);
        // Loading state
        const [loading, setLoading] = useState<boolean>(true);

        // Fetch data when component mounts or id changes
        useEffect(() => {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const response = await auditQueryService.GetAuditInfoSuggest(props.id);
                    setSuggestData(response.data || []);
                } catch (error) {
                    console.error("Error fetching suggest data:", error);
                    setSuggestData([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }, [props.id]);

        // Custom quick filter function
        const quickFilterParser = useCallback((value: string): string[] => {
            return value.split(' ').filter(term => term.length > 0);
        }, []);

        // theme 為 true 時表示暗色模式
        const isDarkMode = theme;
        const [colDefs] = useState<ColDef<AuditInfoSuggest>[]>([
            {field: "uuid", headerName: "uuid", hide: true},
            {field: "suggestItem", headerName: "建議種類"},
            {field: "suggest", headerName: "委員意見"},
            {field: "isAdopted", headerName: "是否參採", cellRenderer: (params: ICellRendererParams) => {
                return params.value ? "是" : "否";
            }},
            {field: "actionDescription", headerName: "執行/說明"},
            {field: "shortTermDate", headerName: "短期計畫", cellRenderer: (params: ICellRendererParams) => {
                return params.value ? ROCformatDateTools.formatDate(params.value) : "";
            }},
            {field: "midTermDate", headerName: "中期計畫", cellRenderer: (params: ICellRendererParams) => {
                return params.value ? ROCformatDateTools.formatDate(params.value) : "";
            }},
            {field: "longTermDate", headerName: "長期計畫", cellRenderer: (params: ICellRendererParams) => {
                return params.value ? ROCformatDateTools.formatDate(params.value) : "";
            }},
            {field: "isImprovementCompleted", headerName: "是否完成改善？", cellRenderer: (params: ICellRendererParams) => {
                return params.value ? "是" : "否";
            }},
            {field: "handlingSituation", headerName: "進度說明"},
            {field: "responsibleUnit", headerName: "負責單位/部門"},
            {field: "budgetAmount", headerName: "預算"},
            {field: "budgetDescription", headerName: "說明"},
            {field: "remarks", headerName: "備註"}
        ]);

        const defaultColDef: ColDef = {
            flex: 1,
            sortable: true,
            filter: true,
            resizable: true
        };

        return (
            <div
                className={isDarkMode ? 'ag-theme-quartz-dark' : 'ag-theme-quartz'}
                style={{
                    width: "100%",
                    height: "700px",
                    marginTop: "20px",
                    zIndex: 1,
                }}
            >
                <AgGridReact
                    ref={gridRef}
                    quickFilterText={filterText}
                    quickFilterParser={quickFilterParser}
                    localeText={AG_GRID_LOCALE_TW}
                    rowData={suggestData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    animateRows={true}
                    pagination={true}
                    paginationPageSize={20}
                    theme={isDarkMode ? themeDarkBlue : themeLightWarm}
                    overlayLoadingTemplate={
                        loading ? '<span class="ag-overlay-loading-center">資料載入中...</span>' : ''
                    }
                    overlayNoRowsTemplate={
                        !loading ? '<span class="ag-overlay-no-rows-center">無資料顯示</span>' : ''
                    }
                />
            </div>
        );
    };

    return (
        <StrictMode>
            <div className="w-full">
                <h2 className="relative text-xl text-base-content mb-4">稽核結果</h2>
                <div className="mb-4 flex flex-wrap gap-2">
                    <input
                        className="input input-bordered w-full max-w-xs"
                        placeholder="搜尋..."
                        value={filterText}
                        onChange={handleFilterChange}
                    />
                    <button
                        className="btn btn-primary w-full max-w-xs"
                        onClick={toggleFilterAdoptedNotCompleted}
                    >
                    {isFilterActive ? '取消篩選' : '套用篩選'}
                    </button>
                </div>
                <SuggestGrid/>
            </div>
        </StrictMode>
    );
}
