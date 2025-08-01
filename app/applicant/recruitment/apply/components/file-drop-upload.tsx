import { Label } from '@/components/ui/label';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowDown, ChevronDown, ChevronUp, FileText, FileUp } from 'lucide-react';
import React from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/legacy/build/pdf.worker';
import { uploadMedia } from '@/api/media';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
/**
 * FileDropUpload is a file upload component that allows users to drag and drop
 * or click to select a file for upload. It shows file type icons based on MIME type,
 * and updates the selected file state in the parent component.
 */
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
  file: File | null;
  hasError?: boolean;
}) {
  /**
   * Callback triggered when a file is dropped or selected.
   * It updates the parent component's file state.
   */
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const response = await uploadMedia({ media: acceptedFiles[0] });
    if (response.data.status) {
      setID(response.data.data[0].id);
      setFile(acceptedFiles[0]);
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
      if (!file || file.type !== 'application/pdf' || !preview) return;

      const fileReader = new FileReader();
      fileReader.onload = async function () {
        const typedArray = new Uint8Array(this.result as ArrayBuffer);

        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context!, viewport, canvas }).promise;
      };
      fileReader.readAsArrayBuffer(file);
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
        )}
        {!file && (
          <div
            {...getRootProps()}
            className={`mt-[6px] sm:w-[464px] h-[150px] w-full border-1 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${hasError
              ? 'border-[#C30606] hover:border-[#C30606] '
              : 'border-gray-300 hover:border-teal-400'
              }`}
            data-test-id="file-drop-zone"
          >
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
