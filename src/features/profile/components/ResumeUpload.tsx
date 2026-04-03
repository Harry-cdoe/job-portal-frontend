import { memo, useCallback, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/cn";

const MAX_MB = 5;
const ALLOWED_MIME = "application/pdf";

interface ResumeUploadProps {
  resumeName?: string;
  resumeUrl?: string;
  isUploading: boolean;
  progress: number;
  onUpload: (file: File) => void;
}

function ResumeUploadBase({ resumeName, resumeUrl, isUploading, progress, onUpload }: ResumeUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const dropZoneClasses = useMemo(
    () =>
      cn(
        "rounded-xl border border-dashed p-5 text-center transition",
        "bg-slate-50 text-sm text-slate-600",
        dragActive ? "border-brand-500 bg-white shadow-inner" : "border-slate-300"
      ),
    [dragActive]
  );

  const validateFile = useCallback((file: File) => {
    if (file.type !== ALLOWED_MIME) {
      throw new Error("Only PDF files are accepted.");
    }

    if (file.size > MAX_MB * 1024 * 1024) {
      throw new Error(`File must be smaller than ${MAX_MB} MB.`);
    }
  }, []);

  const handleFileSelection = useCallback(
    (file?: File) => {
      if (!file) {
        return;
      }

      try {
        validateFile(file);
        setLocalError(null);
        setSelectedFileName(file.name);
        onUpload(file);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Invalid resume selected.";
        setLocalError(message);
        setSelectedFileName(null);
      }
    },
    [onUpload, validateFile]
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleFileSelection(event.target.files?.[0]);
      event.target.value = "";
    },
    [handleFileSelection]
  );

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleDrag = useCallback((event: DragEvent<HTMLDivElement>, active: boolean) => {
    event.preventDefault();
    setDragActive(active);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      handleDrag(event, false);
      handleFileSelection(event.dataTransfer.files?.[0]);
    },
    [handleDrag, handleFileSelection]
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">Resume upload</p>
          <p className="text-xs text-slate-500">Upload a PDF (max {MAX_MB}MB) to keep your profile competitive.</p>
        </div>
        <Button type="button" onClick={openFilePicker} className="px-3 py-1.5 text-xs">
          Select file
        </Button>
      </div>

      <div
        className={dropZoneClasses}
        onDragEnter={(event) => handleDrag(event, true)}
        onDragLeave={(event) => handleDrag(event, false)}
        onDragOver={(event) => handleDrag(event, true)}
        onDrop={handleDrop}
      >
        <p className="text-xs font-medium text-slate-500">Drag & drop here</p>
        <p className="mt-1 text-xs text-slate-400">PDF only</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          aria-label="Upload resume file"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {resumeName && (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-2 text-sm text-slate-700">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Current resume</p>
            <p className="font-medium text-slate-800">{resumeName}</p>
          </div>
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-xs font-semibold text-brand-500 transition hover:text-brand-600"
            >
              Preview
            </a>
          )}
        </div>
      )}

      {!resumeName && selectedFileName && (
        <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 px-4 py-2 text-sm text-slate-700">
          <p className="text-xs uppercase tracking-wide text-slate-500">Selected file</p>
          <p className="font-medium text-slate-800">{selectedFileName}</p>
        </div>
      )}

      {isUploading && (
        <div className="mt-4">
          <div className="h-2 rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-500">Uploading... {progress}%</p>
        </div>
      )}

      {localError && <p className="mt-3 text-xs text-red-500">{localError}</p>}
    </div>
  );
}

export const ResumeUpload = memo(ResumeUploadBase);
ResumeUpload.displayName = "ResumeUpload";
