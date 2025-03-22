import React from "react";
import { useStepContext, FormDataType } from "@/components/Steps/StepComponse";

// 用户数据接口
interface UserData {
  UserName: string;
  Unit: string;
  Position: string;
  email?: string;
}

interface ExtendedFormData extends FormDataType {
  userData?: UserData;
}

export default function IdentityConfirmationForm() {
  const { stepData } = useStepContext();
  const userData = (stepData.userData as UserData) || {};

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">請確認以下身分資訊是否正確</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label text-sm opacity-70">姓名</label>
          <div className="p-2 bg-base-200 rounded">{userData.UserName || '未提供'}</div>
        </div>
        <div className="form-control">
          <label className="label text-sm opacity-70">單位</label>
          <div className="p-2 bg-base-200 rounded">{userData.Unit || '未提供'}</div>
        </div>
        <div className="form-control">
          <label className="label text-sm opacity-70">職稱</label>
          <div className="p-2 bg-base-200 rounded">{userData.Position || '未提供'}</div>
        </div>
        <div className="form-control">
          <label className="label text-sm opacity-70">電子郵件</label>
          <div className="p-2 bg-base-200 rounded">{userData.email || '未提供'}</div>
        </div>
      </div>
    </div>
  );
}
