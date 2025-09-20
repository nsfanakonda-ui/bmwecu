import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export default function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/octet-stream': ['.xdf', '.bin', '.a2l'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = () => {
    onFileSelect(null);
  };

  if (selectedFile) {
    return (
      <div className="bmw-upload-bg border-3 border-dashed border-bmw-blue rounded-xl p-6 transition-all duration-300">
        <div className="flex items-center justify-between bg-bmw-gray rounded-lg p-4 border border-bmw">
          <div className="flex items-center space-x-3">
            <File className="w-8 h-8 text-bmw-cyan" />
            <div>
              <div className="font-medium text-bmw-white">{selectedFile.name}</div>
              <div className="text-sm text-bmw-silver">{formatFileSize(selectedFile.size)}</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            data-testid="button-remove-file"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`bmw-upload-bg border-3 border-dashed border-bmw-blue rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
        isDragActive ? "bmw-upload-hover border-bmw-cyan" : "hover:bmw-upload-hover hover:border-bmw-cyan"
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 text-bmw-blue mx-auto mb-4" />
      <div className="text-xl text-bmw-silver mb-2">
        {isDragActive ? "Dateien hier ablegen..." : "Dateien hier ablegen oder klicken"}
      </div>
      <div className="text-bmw-silver/70 text-sm">
        Unterstützte Formate: XDF, BIN, A2L (Max. 50MB)
      </div>
    </div>
  );
}
