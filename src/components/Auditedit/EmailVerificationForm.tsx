
import React, {JSX} from "react";
import { useStepContext} from "@/components/Steps/StepComponse";
import {EmailVerificationFormData} from "@/app/Auditedit/[id]/page";

interface EmailVerificationFormProps {
  errorMessage:string|undefined;
}
export default function EmailVerificationForm(props: EmailVerificationFormProps){
  const { stepData, updateStepData } = useStepContext();


  /**
   * 處理表單輸入變更
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e 事件物件
   */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const currentFormValues = (stepData.EmailVerificationForm as EmailVerificationFormData) || {};

      updateStepData({
        EmailVerificationForm: {
          ...currentFormValues,
          [name]: value
        }
      });
    };

  return (
    <>
      <div className="space-y-4">
        <p className="text-sm">請輸入您在石化業者管理系統中登記的電子郵件</p>

        <div className="form-control">
          <label className="label">電子郵件</label>
          <input
            type="email"
            name="email"
            className="input input-bordered w-full"
            value={((stepData.EmailVerificationForm as EmailVerificationFormData)?.email) || ''}
            onChange={handleChange}
            placeholder="請輸入電子郵件"
          />
        </div>

        <div className="form-control">
          <label className="label">驗證碼</label>
          <input
            type="text"
            name="VerificationCode"
            className="input input-bordered w-full"
            value={((stepData.EmailVerificationForm as EmailVerificationFormData)?.VerificationCode) || ''}
            onChange={handleChange}
            placeholder="請輸入驗證碼 (測試時任意輸入即可)"
          />
          <label className="label">
            <span className="label-text-alt">測試版本不驗證碼，隨便填寫即可</span>
          </label>
        </div>

        {props.errorMessage && (
          <div className="alert alert-error">
            <span>{props.errorMessage}</span>
          </div>
        )}
      </div>
    </>
  );
}
