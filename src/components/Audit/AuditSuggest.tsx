import React, {StrictMode, useState} from "react";
import {ColDef, colorSchemeDarkBlue, colorSchemeLightWarm, themeQuartz} from "ag-grid-enterprise";
import {AllCommunityModule, ModuleRegistry} from "ag-grid-enterprise";
import {AgGridReact} from "ag-grid-react";
import {useGlobalStore} from '@/store/useGlobalStore';
import { AG_GRID_LOCALE_TW } from '@ag-grid-community/locale';
import {useAuditStore} from "@/store/useAuditStore";
import {AuditSuggestResult} from "@/types/AuditQuery/auditQuery";

ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightWarm = themeQuartz.withPart(colorSchemeLightWarm);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);


const SuggestGrid = () => {
    // 使用全域狀態的布林值主題
    const {theme} = useGlobalStore();
    // rowData
    const SuggestData = useAuditStore(state => state.auditData?.suggests);

    // theme 為 true 時表示暗色模式
    const isDarkMode = theme;
    const [colDefs] = useState<ColDef<AuditSuggestResult>[]>([
        {field: "factory", headerName: "工廠"},
        {field: "auditType", headerName: "督導種類"},
        {field: "suggestItem", headerName: "建議種類"},
        {field:"suggestType",headerName:"建議類型"},
        {field:"suggestCategory",headerName:"建議項目"},
        {field:"suggest",headerName:"委員建議"},
        {field:"participate",headerName:"是否參採"},
        {field:"action",headerName:"執行方式"},
        {field:"shortTerm",headerName:"短期計劃"},
        {field:"midTerm",headerName:"中期計劃"},
        {field:"longTerm",headerName:"長期計劃"},
        {field:"handlingSituation",headerName:"辦理情形"},
        {field:"improveStatus",headerName:"是否完成改善"},
        {field:"responsibleUnit",headerName:"負責單位"},
        {field:"budget",headerName:"預算"},
    ]);

    const defaultColDef: ColDef = {
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,

    };


    return (
        <div
            className='ag-theme-quartz-dark z-1'        //{isDarkMode ? 'ag-theme-quartz-dark' : 'ag-theme-quartz'}
            style={{
                width: "100%",
                height: "700px",
                marginTop: "20px",
                zIndex: 1,
            }}
        >
            <AgGridReact
                localeText={AG_GRID_LOCALE_TW}
                rowData={SuggestData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                animateRows={true}
                pagination={true}
                sideBar={true}
                paginationPageSize={20}
                theme={isDarkMode ? themeDarkBlue : themeLightWarm}
            />
        </div>
    );
};

export default function SuggestResult() {
    return (
        <StrictMode>
            <div className="w-full">
                <h2 className="relative text-xl text-base-content mb-4">稽核結果</h2>
                <SuggestGrid/>
            </div>
        </StrictMode>
    );
}
