"use client"
import React, {useEffect, useState} from 'react';
import Tabs from "@/components/DasisyUI/Tabs";
import BasicInfo, {BasicInfoData} from "@/components/Audit/AuditInfo/BasicInfo";
import SupervisionProgress, {AuditDetail} from "@/components/Audit/AuditInfo/SupervisionProgress";
import {auditQueryService} from "@/services/Audit/auditQueryService";
import {Button} from "@mantine/core";
import {toast} from "react-toastify";
import SuggestResult from "@/components/Audit/AuditInfo/AuditSuggestInfo";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
      const { id: auditId } = React.use(params);
      const [isLoading, setIsLoading] = useState(true);
      const [supervisoryData, setSupervisoryData] = useState<BasicInfoData | null>(null);
      // Fix the type to be an array of AuditDetail objects
      const [supervisionItems, setSupervisionItems] = useState<AuditDetail[] | null>(null);
      const [error, setError] = useState<string | null>(null);

    // 定義標籤頁切換處理函數
    const handleTabChange = (tabId: string) => {
        console.log(`切換到標籤: ${tabId}`);
    };

    // Fetch data when component mounts
    useEffect(() => {
        const fetchData = async () => {
          try {
            setIsLoading(true);
            const data = await auditQueryService.GetBasicInformation(auditId);
            setSupervisoryData(data);
            const dayline = await auditQueryService.GetAuditDetailInfo(auditId);
            setSupervisionItems(dayline);
            setError(null);
          } catch (err) {
            console.error("Error fetching audit data:", err);
            setError("無法載入督導資訊，請稍後再試");
          } finally {
            setIsLoading(false);
          }
        };

        fetchData();
    }, [auditId]);


    const handleCreateDetail = () => {
        // 这里可以打开模态窗口或导航到表单页面
    };

    const TabsItems = [
        {
            id: "1",
            label: "督導資訊",
            content: (
                <>
                    <BasicInfo data={supervisoryData === null ? undefined : supervisoryData} />
                </>
            ),
            disabled: false
        },
        {
            id: "2",
            label: "督導歷程",
            content: (
                <>
                <SupervisionProgress
                    auditDetails={supervisionItems} // Changed from timelineItems to auditDetails
                    onCreateDetail={handleCreateDetail}
                variant ="standard"
                />
                </>
            ),
            disabled: false
        },
        {
            id: "3",
            label: "監察院來文",
            content: (
                <>
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-2">監察院來文內容</h3>
                        <p>這裡顯示來自監察院的文件...</p>
                        <Button onClick={() => toast.warn('請填寫所有必填欄位')}>123</Button>
                    </div>
                </>
            ),
            disabled: true
        },
        {
            id: "4",
            label: "執行規劃",
            content: (
                <>
                    <SuggestResult id={auditId} />
                </>
            ),
            disabled: false
        },
        {
            id: "5",
            label: "改善計畫",
            content: (
                <>
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-2">改善計畫內容</h3>
                        <p>這裡是改善計劃的具體措施...</p>
                    </div>
                </>
            ),
            disabled: false
        },
    ];

    return (
        <>
            <div className="w-11/12 mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6 text-base-content">督導管理系統</h1>

                {error && (
                    <div className="alert alert-error mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{error}</span>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center p-8">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : (
                    <Tabs
                      tabs={TabsItems}
                      settings={{
                        maxWidth: "100%"
                      }}
                      onChange={handleTabChange}
                      cardClassName="my-4 bg-gray-50" // 自定義卡片樣式
                    />
                )}
            </div>
        </>
    );
}
