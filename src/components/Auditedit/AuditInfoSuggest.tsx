import React, {StrictMode, useState} from "react";
import {ColDef, colorSchemeDarkBlue, colorSchemeLightWarm, themeQuartz} from "ag-grid-enterprise";
import {AllCommunityModule, ModuleRegistry} from "ag-grid-enterprise";
import {AgGridReact} from "ag-grid-react";
import {useGlobalStore} from '@/store/useGlobalStore';
import { AG_GRID_LOCALE_TW } from '@ag-grid-community/locale';
import {useStepContext} from "@/components/Steps/StepComponse";
import {ICellRendererParams} from "ag-grid-community";
import {ROCformatDateTools} from "@/utils/Timetool";

ModuleRegistry.registerModules([AllCommunityModule]);
const themeLightWarm = themeQuartz.withPart(colorSchemeLightWarm);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);


export interface AuditInfoSuggest {
  uuid: string;
  suggestItem: string | null;
  suggest: string | null;
  subSuggest: string | null;
  isAdopted: string | null;
  actionDescription: string | null;
  shortTermDate: string | null;
  midTermDate: string | null;
  longTermDate: string | null;
  handlingSituation: string | null;
  isImprovementCompleted: string | null;
  responsibleUnit: string | null;
  budgetDescription:string|null;
  budgetAmount: string | null;
  remarks: string | null;
}



const SuggestGrid = () => {
    // 使用全域狀態的布林值主題
    const {theme} = useGlobalStore();
    const { stepData, updateStepData } = useStepContext();
    const suggestData =
                      (Array.isArray(stepData.SuggestResult) ? stepData.SuggestResult :
                       (stepData.SuggestResult ? [stepData.SuggestResult] : []));
    const isDarkMode = theme;
    const [colDefs] = useState<ColDef<AuditInfoSuggest>[]>([
        {field:"uuid",headerName:"Uuid",hide:true ,editable:false},
        {field:"suggestItem", headerName: "建議種類" ,hide:true ,editable:false},
        {field:"suggest",headerName:"委員建議",editable:false},
        {field:"subSuggest",headerName:"委員子建議",editable:false},
        {field:"isAdopted",headerName:"是否參採"},
        {field:"actionDescription",headerName:"執行方式"},
        {field:"shortTermDate",headerName:"短期計劃",
        cellRenderer: (params: ICellRendererParams) =>
        params.value ? ROCformatDateTools.formatDate(params.value) : '',},
        {field:"midTermDate",headerName:"中期計劃",
        cellRenderer: (params: ICellRendererParams) =>
        params.value ? ROCformatDateTools.formatDate(params.value) : '',},
        {field:"longTermDate",headerName:"長期計劃",
        cellRenderer: (params: ICellRendererParams) =>
        params.value ? ROCformatDateTools.formatDate(params.value) : '',},
        {field:"handlingSituation",headerName:"辦理情形"},
        {field:"isImprovementCompleted",headerName:"是否完成改善"},
        {field:"responsibleUnit",headerName:"負責單位"},
        {field:"budgetDescription",headerName:"預算說明"},
        {field:"budgetAmount",headerName:"預算＄"},
        {field:"remarks",headerName:"備註"}

    ]);

    const defaultColDef: ColDef = {
        flex: 1,
        sortable: false,
        filter: false,
        resizable: false,
        editable: true,

    };


    return (
        <div
            className='ag-theme-quartz-dark z-1'
            style={{
                width: "100%",
                height: "700px",
                marginTop: "20px",
                zIndex: 1,
            }}
        >
            <AgGridReact
                localeText={AG_GRID_LOCALE_TW}
                rowData={suggestData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                paginationPageSize={20}
                theme={isDarkMode ? themeDarkBlue : themeLightWarm}
            />
        </div>
    );
};

export default function AuditInfoSuggest() {
    return (
        <StrictMode>
            <div className="w-full">
                <h2 className="relative text-xl text-base-content mb-4">稽核結果</h2>
                <SuggestGrid/>
            </div>
        </StrictMode>
    );
}
