// hooks/useFileUpload.ts
'use client'
import { useState, DragEvent, ChangeEvent } from 'react';
import {UploadedFile} from "@/components/Test/RAG";

type DragEventType = DragEvent<HTMLDivElement>;
type FileInputChangeEvent = ChangeEvent<HTMLInputElement>;

interface FileInfo<T = DefaultResponse> {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  filepath?: string;
  response?: T; // 添加 response 欄位存儲上傳響應
}

interface UseFileUploadProps<TResponse> {
  onUpload?: (file: File) => Promise<TResponse>;
  onSuccess?: (response: TResponse, fileId: string) => void;
  onError?: (error: Error, fileId: string) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
  onFileRemoved?: (fileId: string) => void; // 添加刪除成功回調
}

// 修改 useFileUpload hook 的返回類型
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
