'use client';

import { Label } from '@/components/ui/label';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ChevronDown, ChevronUp, FileText, FileUp, Loader, Trash } from 'lucide-react';
import React from 'react';
import { uploadMedia } from '@/api/media';
import { customToast } from '@/components/common/toastr';
import LoadingSpinner from '@/components/common/loading-spinner';

// Dynamically import pdfjs-dist only on client side
let pdfjsLib: typeof import('pdfjs-dist') | null = null;

// Utility function to ensure PDF.js is properly initialized
const ensurePdfJsInitialized = async () => {
  if (typeof window === 'undefined') return null;

  if (!pdfjsLib) {
    const pdfModule = await import('pdfjs-dist');
    pdfjsLib = pdfModule;
  }

  // Always ensure worker source is set
  if (pdfjsLib && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
  }

  return pdfjsLib;
};

// Initialize PDF.js on module load
if (typeof window !== 'undefined') {
  ensurePdfJsInitialized();
}
/**
 * FileDropUpload is a file upload component that allows users to drag and drop
 * or click to select a file for upload. It shows file type icons based on MIME type,
 * and updates the selected file state in the parent component.
 */
interface FileWithUrl {
  name: string;
  url: string;
}

export default function FileDropUpload({
  label,
  setFile,
  setID,
  file,
  hasError = false,
}: {
  label: string;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setID: React.Dispatch<React.SetStateAction<string | null>>;
  file: File | FileWithUrl | null;
  hasError?: boolean;
}) {
  /**
   * Callback triggered when a file is dropped or selected.
   * It updates the parent component's file state.
   */
  const [loading, setLoading] = React.useState<boolean>(false);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setLoading(true);
      const response = await uploadMedia({ media: acceptedFiles[0] });
      if (response.data.status) {
        setID(response.data.data[0].id);
        setFile(acceptedFiles[0]);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      customToast('Error uploading file', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [setFile, setID]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
  });
  const [preview, setPreview] = React.useState<boolean>(false);

  React.useEffect(() => {
    const renderPdf = async () => {
      if (!file || !preview || typeof window === 'undefined') return;

      const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      try {
        // Ensure pdfjsLib is loaded and properly initialized
        const pdfModule = await ensurePdfJsInitialized();
        if (!pdfModule) {
          console.error('Failed to initialize PDF.js');
          return;
        }
        pdfjsLib = pdfModule;

        let pdf;

        if (file instanceof File) {
          // Case 1: file is a real File
          const arrayBuffer = await file.arrayBuffer();
          pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        } else if (typeof file === 'object' && file !== null && 'url' in file && typeof (file as FileWithUrl).url === 'string') {
          // Case 2: file is a URL
          pdf = await pdfjsLib.getDocument({ url: (file as FileWithUrl).url }).promise;
        } else {
          console.warn('Unsupported file type:', file);
          return;
        }

        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport, canvas }).promise;

      } catch (error) {
        console.error('Error rendering PDF:', error);
      }
    };

    renderPdf();
  }, [file, preview]);

  return (
    <div>
      <div className="mt-[19px]">
        <Label
          className="text-[14px]/[22px] font-medium text-[#353535]"
          data-test-id="file-upload-label"
        >
          {label}
        </Label>
        {file && (
          <div className="flex items-start  gap-[10px]">
            <div className="w-full border border-[#bcbcbc] rounded-[8px] p-[20px] cursor-pointer">
              <div className="flex justify-between" onClick={() => setPreview(!preview)}>
                <div className="flex items-center gap-[10px]">
                  <FileText className="size-[20px]" />
                  <p className="text-[14px]/[20px] text-[#353535]">{file.name}</p>
                </div>
                {preview ? (
                  <ChevronUp className="size-[20px]" />
                ) : (
                  <ChevronDown className="size-[20px]" />
                )}
              </div>
              {preview && (
                <div className="mt-[10px]">
                  {/* pdf viewer */}
                  <canvas id="pdf-canvas" className="w-full border border-[#e9e9e9] rounded-[10px]" />
                </div>
              )}
            </div>
            <button onClick={() => setFile(null)} className="text-[#cc0707] cursor-pointer text-[14px]/[20px] mt-[20px]">
              <Trash className="size-[20px]" />
            </button>
          </div>
        )}
        {!file && (
          <div
            {...getRootProps()}
            className={`mt-[6px] sm:w-[464px] h-[150px] w-full border-1 border-dashed rounded-xl p-10 text-center cursor-pointer transition relative ${hasError
              ? 'border-[#C30606] hover:border-[#C30606] '
              : 'border-gray-300 hover:border-teal-400'
              }`}
            data-test-id="file-drop-zone"
          >
            {loading && (
              <div className="flex items-center justify-center w-full h-full bg-[#f5f5f566] absolute top-0 left-0 z-10">
                <LoadingSpinner />
              </div>
            )}
            <input {...getInputProps()} data-test-id="file-input" />
            <div
              className="flex flex-col items-center justify-center text-gray-400"
              data-test-id="file-drop-content"
            >
              <>
                <FileUp className={`size-[56px] text-[#0D978B]`} />
                <p className="text-[14px]/[20px] mt-[10px]" data-test-id="file-drop-instruction">
                  {isDragActive ? (
                    <span className={`font-medium text-[#0D978B]`}>
                      Drop file here...
                    </span>
                  ) : (
                    <>
                      Drop file or{' '}
                      <span className={`font-medium text-[#0D978B]`}>
                        click to upload
                      </span>
                    </>
                  )}
                </p>
              </>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
