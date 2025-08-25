'use client';

import { Label } from '@/components/ui/label';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ChevronDown, ChevronUp, FileText, FileUp, Loader, Trash, CheckCircle, XCircle } from 'lucide-react';
import React from 'react';
import { uploadMedia } from '@/api/media';
import { customToast } from '@/components/common/toastr';


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
  // Generate unique ID for this component instance
  const componentId = React.useMemo(() => `pdf-canvas-${Math.random().toString(36).substr(2, 9)}`, []);
  /**
   * Callback triggered when a file is dropped or selected.
   * It updates the parent component's file state.
   */
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const [uploadStatus, setUploadStatus] = React.useState<'idle' | 'uploading' | 'completed' | 'error'>('idle');
  const [uploadError, setUploadError] = React.useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setUploadStatus('uploading');
      setUploadProgress(5); // Start with 5% to show immediate feedback
      setUploadError('');

      // Simulate progress updates (you can replace this with actual progress tracking)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return 85;
          }
          return prev + Math.random() * 15 + 5; // More realistic progress increments
        });
      }, 150);

      const response = await uploadMedia({ media: acceptedFiles[0] });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('completed');

      if (response.data.status) {
        setID(response.data.data[0].id);
        setFile(acceptedFiles[0]);
      }

      // Reset progress after a delay
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadProgress(0);
      }, 3000); // Give users more time to see the success state

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setUploadStatus('error');
      setUploadError(errorMessage);
      customToast('Error uploading file', errorMessage, 'error');
    }
  }, [setFile, setID]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    disabled: uploadStatus === 'uploading',
  });
  const [preview, setPreview] = React.useState<boolean>(false);
  const [pdfLoading, setPdfLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    let isCancelled = false;

    const renderPdf = async () => {
      if (!file || !preview || typeof window === 'undefined') return;

      const canvas = document.getElementById(componentId) as HTMLCanvasElement;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      try {
        setPdfLoading(true);

        // Clear the canvas first to prevent reuse issues
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Reset canvas dimensions
        canvas.width = 0;
        canvas.height = 0;

        // Ensure pdfjsLib is loaded and properly initialized
        const pdfModule = await ensurePdfJsInitialized();
        if (!pdfModule) {
          console.error('Failed to initialize PDF.js');
          return;
        }
        pdfjsLib = pdfModule;

        // Check if component was unmounted or preview was closed
        if (isCancelled) return;

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

        // Check again if component was unmounted
        if (isCancelled) return;

        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        // Set new canvas dimensions
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render the PDF page
        await page.render({ canvasContext: context, viewport, canvas }).promise;

      } catch (error) {
        if (!isCancelled) {
          console.error('Error rendering PDF:', error);
        }
      } finally {
        if (!isCancelled) {
          setPdfLoading(false);
        }
      }
    };

    renderPdf();

    // Cleanup function to cancel rendering if component unmounts or preview closes
    return () => {
      isCancelled = true;
    };
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
                  <div className="relative w-full border border-[#e9e9e9] rounded-[10px] min-h-[200px]">
                    {pdfLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-[10px]">
                        <div className="flex flex-col items-center gap-2">
                          <div className="size-8 rounded-full border-2 border-[#0D978B] border-t-transparent animate-spin" />
                          <p className="text-sm text-gray-600">Loading PDF...</p>
                        </div>
                      </div>
                    )}
                    <canvas id={componentId} className="w-full" />
                  </div>
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
            className={`mt-[6px] sm:w-[464px] h-[150px] w-full border-1 border-dashed rounded-xl p-10 text-center transition relative ${uploadStatus === 'uploading'
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : hasError
                ? 'border-[#C30606] hover:border-[#C30606] cursor-pointer'
                : 'border-gray-300 hover:border-teal-400 cursor-pointer'
              }`}
            data-test-id="file-drop-zone"
          >
            <input {...getInputProps()} data-test-id="file-input" />

            {/* Progress Bar - Inside the drop zone */}
            {uploadStatus !== 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-95 rounded-xl">
                <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {uploadStatus === 'completed' && <CheckCircle className="size-6 text-[#0D978B]" />}
                    {uploadStatus === 'error' && <XCircle className="size-6 text-red-500" />}
                    {uploadStatus === 'uploading' && (
                      <div className="size-6 rounded-full border-2 border-[#0D978B] border-t-transparent animate-spin" />
                    )}
                  </div>

                  {/* Status Text */}
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">
                      {uploadStatus === 'uploading' ? 'Uploading PDF...' : uploadStatus === 'completed' ? 'Upload complete' : 'Upload failed'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {uploadStatus === 'uploading' ? `${Math.round(uploadProgress)}%` : uploadStatus === 'completed' ? 'File uploaded successfully' : 'Please try again'}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ease-out ${uploadStatus === 'uploading' ? 'bg-[#0D978B]' :
                        uploadStatus === 'completed' ? 'bg-[#0D978B]' :
                          'bg-red-500'
                        }`}
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>

                  {/* Error Message */}
                  {uploadStatus === 'error' && uploadError && (
                    <p className="text-xs text-red-600 text-center mt-2">
                      {uploadError}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Default Drop Zone Content - Only show when not uploading */}
            {uploadStatus === 'idle' && (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
