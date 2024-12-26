// components/SignatureCanvas.tsx
'use client';
import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
  onSave: (signature: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave }) => {
  const signatureRef = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const handleSave = () => {
    if (signatureRef.current) {
      // 獲取簽名的 base64 圖片數據
      const signatureData = signatureRef.current.toDataURL();
      onSave(signatureData);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">簽名區</h2>
        <div className="border border-gray-300 rounded-lg">
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              className: 'w-full h-64',
              style: {
                borderRadius: '0.5rem',
                backgroundColor: '#fff'
              }
            }}
          />
        </div>
        <div className="flex gap-4 mt-4">
          <button
            className="btn btn-outline"
            onClick={handleClear}
          >
            清除
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

