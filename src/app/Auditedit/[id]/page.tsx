"use client"
import React, { useState } from 'react';
import {
  FormDataType,
  MultiStepForm,
  StepAnimation,
  StepCard,
  StepContent,
  StepIndicatorComponent, StepNavigationWrapper, useStepContext
} from '@/components/Steps/StepComponse';
import IdentityConfirmationForm from "@/components/Auditedit/IdentityConfirmationForm";
import EmailVerificationForm from "@/components/Auditedit/EmailVerificationForm";
import CompletePage from "@/components/Auditedit/CompletePage";
import {auditQueryService} from "@/services/Audit/auditQueryService";
import useWindowSize from "@/components/Tools/useWindowSize";
import UnsupportedDevicePage from "@/components/Tools/UnsupportedDevicePage";
import AuditeditBasicInfo from "@/components/Auditedit/AuditeditBasicInfo";
import {AuditBasicResult, AuditSuggestResult} from "@/types/AuditQuery/auditQuery";
import {toast} from "react-toastify";
import AuditInfoSuggest from "@/components/Auditedit/AuditInfoSuggest";


// 定义共享的接口
interface UserData {
  Uuid:string;
  UserName: string;
  Unit: string;
  Position: string;
  email?: string;
  verificationCode?: string;
  auditId?: string;
}

interface ExtendedFormData extends FormDataType {
  EmailVerificationForm?: EmailVerificationFormData;
  userData?: UserData;
  BasicInfo?:AuditBasicResult;
  SuggestResult?:AuditSuggestResult;
  identityVerified?: boolean;
  verificationError?: string;
  completedAuditIds?: Set<string|number>; // 添加這一行
  selectedAuditBasic?: AuditBasicResult; // 添加這一行
}

export interface EmailVerificationFormData {
  email: string;
  VerificationCode: string;
}

// 步驟定義
const steps = [
  { title: '身分驗證' },
  { title: '身分確認' },
  { title: '顯示需填辦理督導資料' },
  { title: "編輯需填辦理督導資料"},
  { title: "編輯需填辦理改善計畫"},
  { title: "列印報表"},
  { title: "完成"},
];



export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: auditId } = React.use(params);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<undefined|string>(undefined);
  const [completedAuditIds, setCompletedAuditIds] = useState<Set<string>>(new Set());
  const [auditBasicResult, setAuditBasicResult] = useState<AuditBasicResult | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(-1); // -1 表示在列表頁
  const AuditItem = [{id:0,data:"123",state:false},{id:1,data:"123",state:false},{id:2,data:"123",state:false}];
  const size = useWindowSize();
  // 初始化時
    const { updateStepData } = useStepContext();
    updateStepData({
      completedAuditIds: new Set<string>()
    });

    // 當用戶完成填寫某筆數據時
    const markAuditAsCompleted = (auditId: string) => {
      const newCompletedIds = new Set(completedAuditIds);
      newCompletedIds.add(auditId);
      setCompletedAuditIds(newCompletedIds);

      // 同時更新 stepData
      updateStepData({
        completedAuditIds: newCompletedIds
      });
    };
  // 處理表單完成
  const handleFormComplete = async (data: FormDataType): Promise<void> => {
    console.log('表單提交成功', data);
    // 這裡可以加入實際的API調用
  };

    if (size && size.width !== undefined && size.width < 768) {
      return (
        <>
        <UnsupportedDevicePage
          minWidth={768}
          redirectUrl="/Home"
        />
        </>
      );
    }
  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8 text-base-content">石化業者督導資料回填系統</h1>

      <MultiStepForm
        initialData={{ completedAuditIds: new Set<string>() } as ExtendedFormData}
        onComplete={handleFormComplete}
        totalStepsCount={7}
      >
        {/* 步驟指示器 */}
        <StepIndicatorComponent steps={steps} />

        {/* 步驟內容 */}
        <StepAnimation>
          {/* 步驟 1: 身分驗證 */}
          <StepContent step={0}>
            <StepCard title="身分驗證">
              <EmailVerificationForm errorMessage={errorMessage} />
              <StepNavigationWrapper
                nextLabel="驗證並繼續"
                isNextLoading={isSubmitting}
                hidePrev={true}
                nextDisabledCondition={(stepData) => {
                  const formData = stepData.EmailVerificationForm as EmailVerificationFormData;
                  return false
                }}
                onSubmit={(stepData, updateStepData) => {
                  const formData = stepData.EmailVerificationForm as EmailVerificationFormData;

                  if (!formData.email || !formData.VerificationCode) {
                    updateStepData({ verificationError: "請輸入電子郵件和驗證碼" });
                    return false;
                  }


                  try {
                    setIsSubmitting(true);
                    const data = {
                      auditId: auditId,
                      email: formData.email,
                      verificationCode: formData.VerificationCode,
                    }
                    const response =auditQueryService.VerificationEmailwithUrl(data)
                   if (response.success && response.data) {
                    // Explicitly define the userData object with the correct type
                  const userData = {
                    Uuid: response.data.UserId,  // Make sure this matches what your API returns
                    UserName: response.data.UserName,
                    Unit: response.data.Unit,
                    Position: response.data.Position,
                    email: formData.email,
                    auditId: auditId
                  };

                  updateStepData({
                    userData: userData,
                    identityVerified: true,
                    verificationError: undefined
                  });

                    }
                    setIsSubmitting(false);
                    return true;
                  } catch (error) {
                    updateStepData({ verificationError: "驗證過程中發生錯誤" });
                    setIsSubmitting(false);
                    return false;
                  }
                }}
              />
            </StepCard>
          </StepContent>

        {/* Step 2: Identity confirmation */}
          <StepContent step={1}>
            <StepCard title="身分確認">
              <IdentityConfirmationForm />
              <StepNavigationWrapper
                prevLabel="返回"
                nextLabel="確認並繼續"
                onSubmit={async (stepData, updateStepData) => {
                  try {
                     const userData = stepData.userData as UserData | undefined;
                      if (!userData || !userData.Uuid) {
                        setErrorMessage("用戶ID無效");
                        return false;
                      }

                    const response = await auditQueryService.getBasicInfoByUserId(userData.Uuid);

                    if (response && response.success) {
                      updateStepData({
                        BasicInfo: response.data
                      });
                      return true;
                    } else {
                      setErrorMessage(response?.message || "無法獲取督導資料");
                      return false;
                    }
                  } catch (error) {
                    console.error("Error fetching audit data:", error);
                    setErrorMessage("獲取督導資料時發生錯誤");
                    return false;
                  }
                }}
              />
            </StepCard>
          </StepContent>
          {/* 步驟 3: 顯示需辦理之督導資料 */}
          <StepContent step={2}>
            <StepCard title="顯示需填辦理督導資料">
              <AuditeditBasicInfo onRowSelected={setAuditBasicResult} />
             <StepNavigationWrapper
                prevLabel="返回"
                nextLabel="選擇並繼續"
                nextDisabledCondition={(stepData) => {
                  // 檢查是否有選擇督導記錄
                  const selectedAudit = stepData.selectedAuditBasic as AuditBasicResult | undefined;
                  // 如果沒有選擇督導記錄或沒有uuid，禁用下一步按鈕
                  return !selectedAudit || !selectedAudit.uuid;
                }}
                onSubmit={async (stepData, updateStepData) => {
                  const selectedAudit = stepData.selectedAuditBasic as AuditBasicResult | undefined;

                  // 再次檢查是否有選擇督導記錄
                  if (!selectedAudit || !selectedAudit.uuid) {
                    // 可以在這裡添加一些提示，例如使用toast顯示錯誤消息
                    toast.warn("請先選擇一筆督導記錄");
                    return false; // 阻止進入下一步
                  }
                  try {
                    const response =await auditQueryService.GetAuditInfoSuggest(selectedAudit.uuid);
                    if (response && response.success) {
                      updateStepData({
                        SuggestResult: response.data
                      });
                      return true;
                    } else {
                      setErrorMessage(response?.message || "無法獲取督導資料");
                      return false;
                    }
                  } catch (error) {
                    console.error("Error fetching audit data:", error);
                    setErrorMessage("獲取督導資料時發生錯誤");
                    return false;
                  }
                }}
              />
            </StepCard>
          </StepContent>
          <StepContent step={3}>
            <StepCard title="編輯需填辦理督導資料">
              <AuditInfoSuggest />
              <StepNavigationWrapper
                prevLabel="返回"
                nextLabel="確認並繼續"
                onSubmit={(stepData, updateStepData) => {
                // 返回 true 表示可以進入下一步
                return true;
              }}
              />
            </StepCard>
          </StepContent>
          <StepContent step={4}>
            <StepCard title="編輯需填辦理改善計畫">
              <IdentityConfirmationForm />
              <StepNavigationWrapper
                prevLabel="返回"
                nextLabel="確認並繼續"
                onSubmit={(stepData, updateStepData) => {
                  // 保存當前改善計畫數據
                  // ...
                  return true; // 允許正常的下一步導航
                }}
              />
            </StepCard>
          </StepContent>
          <StepContent step={5}>
            <StepCard title="列印報表">
              <IdentityConfirmationForm />
              <StepNavigationWrapper
                prevLabel="返回"
                nextLabel="確認並繼續"
                onSubmit={(stepData, updateStepData) => {
                // 返回 true 表示可以進入下一步
                return true
                }}
                customNavigation={{
                  enabled: true,
                  targetStep: 2, // 回到步驟2（列表頁）
                  label: "儲存並返回列表",
                  className: "btn-info",
                  disabledCondition:(stepData) => {
                    // 如果需要條件控制按鈕禁用狀態，可以在這裡添加
                    return false;
                  },
                  onNavigate: (stepData, updateStepData) => {
                    // 獲取當前選中的審計項目
                    const selectedAuditBasic = stepData.selectedAuditBasic as AuditBasicResult | undefined;

                    if (selectedAuditBasic?.uuid) {
                      // 獲取舊的完成 ID 集合
                      const oldCompletedIds = stepData.completedAuditIds as Set<string> || new Set<string>();

                      // 創建新的集合並添加當前 UUID
                      const newCompletedIds = new Set(oldCompletedIds);
                      newCompletedIds.add(selectedAuditBasic.uuid);

                      // 更新 stepData
                      updateStepData({
                        completedAuditIds: newCompletedIds
                      });

                      console.log("已標記完成: ", selectedAuditBasic.uuid);
                    } else {
                      console.warn("無法標記完成: 未找到有效的UUID");
                    }

                    // 返回列表頁
                    return true;
                  }
                }}

              />
            </StepCard>
          </StepContent>
          <StepContent step={6}>
            <StepCard>
              <CompletePage />
            </StepCard>
          </StepContent>
        </StepAnimation>
      </MultiStepForm>
    </div>
  );
}
