// hooks/useFileUpload.ts
'use client'
import { useState, DragEvent, ChangeEvent } from 'react';
import {UploadedFile} from "@/components/Test/RAG";

type DragEventType = DragEvent<HTMLDivElement>;
type FileInputChangeEvent = ChangeEvent<HTMLInputElement>;


/**
 * 文件信息接口
 *
 * @interface FileInfo
 * @template T 上傳回應的類型。
 * @member {string} id 文件唯一識別 ID。
 * @member {File} file 文件對象。
 * @member {number} progress 上傳進度 (0-100)。
 * @member {'pending' | 'uploading' | 'success' | 'error'} status 上傳狀態。
 * @member {string} [error] 錯誤信息（若有錯誤）。
 * @member {string} [filepath] 上傳成功後的文件路徑。
 * @member {T} [response] 上傳回應結果。
 */
interface FileInfo<T = DefaultResponse> {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  filepath?: string;
  response?: T; // 添加 response 欄位存儲上傳響應
}

/**
 * Hook 使用的參數接口
 *
 * @interface UseFileUploadProps
 * @template TResponse 上傳回應的類型。
 * @member {Function} [onUpload] 上傳函式，應該接受一個 File 對象並返回一個 Promise。
 * @member {Function} [onSuccess] 上傳成功的回調函式。
 * @member {Function} [onError] 上傳失敗的回調函式。
 * @member {number} [maxFiles] 允許上傳的最大文件數量。
 * @member {number} [maxSize] 允許上傳的最大文件大小（以字節為單位）。
 * @member {string[]} [acceptedFileTypes] 允許的文件類型。
 * @member {Function} [onFileRemoved] 文件刪除成功的回調函式。
 */
interface UseFileUploadProps<TResponse> {
  onUpload?: (file: File) => Promise<TResponse>;
  onSuccess?: (response: TResponse, fileId: string) => void;
  onError?: (error: Error, fileId: string) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
  onFileRemoved?: (fileId: string) => void;
}

/**
 * Hook 返回的對象接口
 *
 * @interface UseFileUploadReturn
 * @template T 默認響應類型。
 * @member {boolean} loading 是否正在加載。
 * @member {Error | null} error 當前錯誤信息。
 * @member {boolean} isDragging 是否正在拖動文件。
 * @member {FileInfo<T>[]} files 當前管理的文件列表。
 * @member {object} handleDragEvents 包含處理拖動事件的方法。
 * @member {Function} handleFileChange 處理文件選擇變更的方法。
 * @member {Function} removeFile 移除文件的方法。
 * @member {Function} clearFiles 清空所有文件的方法。
 */
interface UseFileUploadReturn<T = DefaultResponse> {
  loading: boolean;
  error: Error | null;
  isDragging: boolean;
  files: FileInfo<T>[];
  handleDragEvents: {
    handleDragEnter: (e: DragEventType) => void;
    handleDragLeave: (e: DragEventType) => void;
    handleDragOver: (e: DragEventType) => void;
    handleDrop: (e: DragEventType) => Promise<void>;
  };
  handleFileChange: (e: FileInputChangeEvent) => Promise<void>;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
}

interface DefaultResponse {
  success: boolean;
  message: string;
}

/**
 * 文件上傳 Hook 使用 React 狀態和回調來管理文件的拖放和上傳過程。
 *
 * @template TResponse 上傳回應的類型。
 * @param {UseFileUploadProps<TResponse>} params - Hook 的參數。
 * @returns {UseFileUploadReturn<TResponse>} 包含檔案管理方法和狀態的物件。
 */
export function useFileUpload<TResponse = DefaultResponse>({
  onUpload,
  onSuccess,
  onError,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedFileTypes = []
}: UseFileUploadProps<TResponse> = {}): UseFileUploadReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<FileInfo[]>([]);


  const validateFile = (file: File): Error | null => {
    if (maxSize && file.size > maxSize) {
      return new Error(`檔案上限${maxSize / 1024 / 1024}MB,請壓縮再試`);
    }

    if (acceptedFileTypes && acceptedFileTypes.length > 0 && !acceptedFileTypes.includes(file.type)) {
      return new Error('檔案類型不支援');
    }

    return null;
  };

  const handleDragEvents = {
    handleDragEnter: (e: DragEventType): void => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },

    handleDragLeave: (e: DragEventType): void => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.relatedTarget as Node | null;
      if (target && !e.currentTarget.contains(target)) {
        setIsDragging(false);
      }
    },

    handleDragOver: (e: DragEventType): void => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },

    handleDrop: async (e: DragEventType): Promise<void> => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (loading) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      const remainingSlots = maxFiles - files.length;

      if (remainingSlots <= 0) {
        setError(new Error(`Maximum number of files (${maxFiles}) reached`));
        return;
      }

      const filesToUpload = droppedFiles.slice(0, remainingSlots);
      await Promise.all(filesToUpload.map(handleUpload));
    }
  };

  const handleFileChange = async (e: FileInputChangeEvent): Promise<void> => {
    if (loading) return;

    const selectedFiles = Array.from(e.target.files || []);
    const remainingSlots = maxFiles - files.length;

    if (remainingSlots <= 0) {
      setError(new Error(`Maximum number of files (${maxFiles}) reached`));
      return;
    }

    const filesToUpload = selectedFiles.slice(0, remainingSlots);
    await Promise.all(filesToUpload.map(handleUpload));

    // Reset input value to allow uploading the same file again
    e.target.value = '';
  };

  const handleUpload = async (file: File): Promise<void> => {
    const tempId = 'temp-' + Date.now(); // 臨時 ID
    const validationError = validateFile(file);

    if (validationError) {
      setFiles(prev => [...prev, {
        id: tempId,
        file,
        progress: 0,
        status: 'error',
        error: validationError.message
      }]);
      return;
    }

    setFiles(prev => [...prev, {
      id: tempId, // 使用臨時 ID
      file,
      progress: 0,
      status: 'uploading'
    }]);

    try {
      if (onUpload) {
        const response = await onUpload(file);
        const dbId = (response as UploadedFile).id.toString(); // 使用類型斷言
        // 更新檔案列表，將臨時 ID 替換為資料庫 ID
        setFiles(prev => prev.map(f =>
          f.id === tempId
            ? { ...f, id: dbId, status: 'success', progress: 100 }
            : f
        ));

        onSuccess?.(response, dbId);
      } else {
        // Default upload logic
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json() as TResponse;
        setFiles(prev => prev.map(f =>
          f.id === tempId ? { ...f, status: 'success', progress: 100 } : f
        ));
        onSuccess?.(result, tempId);
      }
    } catch (err) {
      const errorInstance = err instanceof Error ? err : new Error(String(err));
      setFiles(prev => prev.map(f =>
        f.id === tempId ? { ...f, status: 'error', error: errorInstance.message } : f
      ));
      onError?.(errorInstance, tempId);
    }
  };

  const removeFile = (fileId: string): void => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setError(null);
  };

  const clearFiles = (): void => {
    setFiles([]);
    setError(null);
  };

  return {
    loading,
    error,
    isDragging,
    files,
    handleDragEvents,
    handleFileChange,
    removeFile,
    clearFiles
  };
}
