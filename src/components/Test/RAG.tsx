"use client"
import React, { useState } from 'react';
import { FileText, Send } from 'lucide-react';
import { toast } from "react-toastify";
import axios from "axios";
import { FileUpload } from "@/components/File/FileUpload";

export interface UploadedFile {
  id: number;
  file_path: string;
  original_name: string;
  created_at: string;
  size: number;
}

type FileVectorRequest = {
  filepath: string;
  isRemove: boolean;
};

interface QueryRequest {
  question: string;
}

interface QueryResponse {
  answer: string;
}

export default function FileUploadComponent() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleQuery = async (): Promise<void> => {
    try {
      setLoading(true);

      const queryRequest: QueryRequest = {
        question: question
      };

      const response = await axios.post('/app/rag/query', queryRequest, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        toast.error('查詢失敗');
        return;
      }

      const data = response.data as QueryResponse;
      setAnswer(data.answer);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '查詢失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <FileUpload<UploadedFile>
          // maxFiles = 10,
          // maxSize = 10485760,
          // acceptedFileTypes = [],
            maxFiles={1}
            maxSize={10485760}
            acceptedFileTypes={["image/png", "image/jpeg", "image/webp","application/pdf"]}
          onUpload={async (file) => {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.put('/app/rag/upload_data', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            const uploadedFile = response.data as UploadedFile;

            // 處理向量化
            const vectorRequest: FileVectorRequest = {
              filepath: uploadedFile.file_path,
              isRemove: false
            };

            await axios.post('/app/rag/add_file_vector', vectorRequest);

            return uploadedFile;
          }}
          onSuccess={(response,fileId) => {
            setUploadedFile(response);
            toast.success('檔案上傳成功');
          }}
          onError={(error) => {
            toast.error(error.message);
          }}
          className="w-full"
        />



        <div className="space-y-2">
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="輸入您的問題..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            onClick={handleQuery}
            disabled={loading || !question}
          >
            {loading ? (
              '處理中...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                發送問題
              </>
            )}
          </button>
        </div>

        {answer && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">回答：</h3>
            <p className="text-gray-700">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};
