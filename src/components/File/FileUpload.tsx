// components/File/FileUpload.tsx
import React from 'react';
import { Upload, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useFileUpload } from "@/hooks/useFileUpload";
import axios from "axios";
import {toast} from "react-toastify";

interface DefaultResponse {
  success: boolean;
  message: string;
}

interface FileUploadProps<TResponse> {
  onUpload?: (file: File) => Promise<TResponse>;
  onSuccess?: (response: TResponse, fileId: string) => void;
  onError?: (error: Error, fileId: string) => void;
  className?: string;
  maxFiles?: number;
  maxSize?: number;
  acceptedFileTypes?: string[];
}
interface removeRequest{
    fileId: string;
    filetype:string;
}

export function FileUpload<TResponse = DefaultResponse>({
  onUpload,
  onSuccess,
  onError,
  className = '',
  maxFiles = 10,
  maxSize = 10485760,
  acceptedFileTypes = []
}: FileUploadProps<TResponse>) {
  const {
    loading,
    error,
    isDragging,
    files,
    handleDragEvents,
    handleFileChange,
    removeFile
  } = useFileUpload<TResponse>({
    onUpload,
    onSuccess,
    onError,
    maxFiles,
    maxSize,
    acceptedFileTypes
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };
// 修正函數聲明
const filedel = async (fileid: string, type: string) => {
  try {
    // 取得 MIME 類型的副檔名部分
    const typename = type.split("/")[1];
    // 加上 `.`
    const extension = `.${typename}`;

    // 建立請求物件
    const Request: removeRequest = {
      fileId: fileid,
      filetype: extension
    };

    // 發送請求
    await axios.post(`/app/rag/remove_file`, Request);

    // 成功後移除文件
    removeFile(fileid);
  } catch (error) {
    // 顯示錯誤訊息
    toast.error((error as Error).message);
  }
};

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className="w-full"
        onDragEnter={handleDragEvents.handleDragEnter}
        onDragLeave={handleDragEvents.handleDragLeave}
        onDragOver={handleDragEvents.handleDragOver}
        onDrop={handleDragEvents.handleDrop}
      >
        <label
          className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className={`w-10 h-10 mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">點擊上傳</span> 或拖放檔案至此
            </p>
            <p className="text-xs text-gray-500">
              {loading ? '上傳中...' : `最多 ${maxFiles} 個檔案`}
              {maxSize && ` • 單檔上限 ${formatFileSize(maxSize)}`}
              {acceptedFileTypes.length > 0 && ` • ${acceptedFileTypes.join(', ')}`}
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={loading}
            multiple
            accept={acceptedFileTypes.join(',')}
          />
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-2 text-sm text-red-500 bg-red-50 rounded">
          <AlertCircle className="w-4 h-4" />
          <span>{error.message}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(({ id, file, status, progress, error: fileError }) => (
              <div
                  key={id}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg"
              >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                      {status === 'uploading' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin"/>}
                      {status === 'success' && <CheckCircle className="w-5 h-5 text-green-500"/>}
                      {status === 'error' && <AlertCircle className="w-5 h-5 text-red-500"/>}

                      <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                              {formatFileSize(file.size)}
                              {fileError && <span className="text-red-500"> • {fileError}</span>}
                          </p>
                      </div>
                  </div>

                  {status === 'uploading' && (
                      <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{width: `${progress}%`}}
                          />
                      </div>
                  )}

                  <button
                      onClick={() => filedel(id,file.type) }

                      className="ml-4 p-1 text-gray-400 hover:text-gray-500"
                  >
                      <X className="w-5 h-5"/>
                  </button>
              </div>
          ))}
        </div>
      )}
    </div>
  );
}
