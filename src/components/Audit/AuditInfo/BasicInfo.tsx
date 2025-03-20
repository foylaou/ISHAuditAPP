import React from 'react';
import {MoneyTool} from "@/utils/Money";


export interface BasicInfoData {
  industrialArea: string;
  company: string;
  factory: string;
  auditType: string;
  auditCause: string;
  incidentDatetime: string;
  accidentCause: string;
  isWorkStopped: string;
  isPenalized: string;
  participateStatusVal: string;
  improveStatusVal: string;
  incidentDescription: string;
  penaltyAmount: string;
}


interface BasicInfoProps {
  data: BasicInfoData | null | undefined;
}

export default function BasicInfo({ data }:BasicInfoProps) {
  console.log("Raw data object:", data);

  if (!data) {

    return (
        <div className="card bg-base-300 shadow-xl">
          <div className="card-body p-4 sm:p-6">
            {/* 第一行 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
              <div className="flex flex-col gap-2">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="skeleton h-4 w-16"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="skeleton h-4 w-16"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="skeleton h-4 w-24"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="skeleton h-4 w-24"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
            </div>

            {/* 第二行 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <div className="skeleton h-4 w-24"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="skeleton h-4 w-24"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
            </div>

            {/* 第三行 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="skeleton h-4 w-36"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
            </div>

            {/* 督導說明 */}
            <div className="flex flex-col gap-2 mt-4">
              <div className="skeleton h-4 w-24"></div>
              <div className="skeleton h-24 w-full"></div>
            </div>

            {/* 裁罰 */}
            <div className="flex flex-col gap-2 mt-4">
              <div className="skeleton h-4 w-16"></div>
              <div className="skeleton h-24 w-full"></div>
            </div>
          </div>
        </div>
    );
  }


  const {
    industrialArea,
    company,
    factory,
    auditType,
    auditCause,
    incidentDatetime,
    accidentCause,
    isWorkStopped,
    isPenalized,
    participateStatusVal,
    improveStatusVal,
    incidentDescription,
    penaltyAmount
  } = data || {};
  return (
      <div className="card bg-base-200 ">
        <div className="card-body p-4 sm:p-6">
          {/* 第一行 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">工業區:</span>
              </label>
              <input
                  type="text"
                  className="input input-bordered w-full text-base-content"
                  value={industrialArea || ""}
                  readOnly
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">公司:</span>
              </label>
              <input
                  type="text"
                  className="input input-bordered w-full text-base-content"
                  value={company || ""}
                  readOnly
              />

            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">工廠:</span>
              </label>
              <input
                  type="text"
                  className="input input-bordered w-full text-base-content"
                  value={factory || ''}
                  readOnly
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">督導種類:</span>
              </label>
              <input
                  type="text"
                  className="input input-bordered w-full"
                  value={auditType || ''}
                  readOnly
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">督導原因:</span>
              </label>
              <input
                  type="text"
                  className="input input-bordered w-full text-base-content"
                  value={auditCause || ''}
                  readOnly
              />
            </div>
          </div>

          {/* 第二行 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">事故時間:</span>
              </label>
              <input
                  type="text"
                  className="input input-bordered w-full text-base-content"
              value={incidentDatetime || ''}
              readOnly
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">災害類型:</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full text-base-content"
              value={accidentCause || ''}
              readOnly
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">是否停工?:</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full text-base-content"
              value={isWorkStopped}
              readOnly
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">是否裁罰?:</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full text-base-content"
              value={isPenalized}
              readOnly
            />
          </div>
        </div>

        {/* 第三行 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">參採率(%):</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full text-base-content"
              value={participateStatusVal+" %"}
              readOnly
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">改善完成率(%):</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full text-base-content"
              value={improveStatusVal+" %" || ''}
              readOnly
            />
          </div>
        </div>

        {/* 督導說明 */}
        <div className="form-control w-full mt-2">
          <label className="label">
            <span className="label-text font-medium">督導說明:</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24 w-full text-base-content"
            placeholder="無"
            value={incidentDescription || ''}
            readOnly
          />
        </div>

        {/* 裁罰 */}
        <div className="form-control w-full mt-2">
          <label className="label">
            <span className="label-text font-medium">裁罰:</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24 w-full text-base-content"
            placeholder="無"
            value={penaltyAmount == "0" || penaltyAmount == null ? '未裁罰' : MoneyTool.toTaiwanBigMoney(penaltyAmount)}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
