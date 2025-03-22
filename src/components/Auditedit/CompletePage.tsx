'use client'
import React, { ReactElement } from 'react';
import {Button} from "@mantine/core";


// 完成頁面组件
export default function CompletePage(): ReactElement {
  return (
    <div className="text-center py-8">
      <div className="text-success text-5xl mb-4">✓</div>
      <h2 className="text-2xl font-bold">督導資料回填完成！</h2>
      <p className="mt-2">感謝您完成石化業者督導資料回填</p>
      <p className="mt-1">系統已記錄您的回填資料</p>

      <div className="mt-8">
        <Button className="btn btn-primary text-primary-content"
                onClick={() => {
    window.location.href = "about:blank";
  }}>關閉分頁</Button>
      </div>
    </div>
  );
}
