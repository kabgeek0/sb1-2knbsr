import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface VoiceUploaderProps {
  onFileSelected: (file: File) => void;
}

const VoiceUploader: React.FC<VoiceUploaderProps> = ({ onFileSelected }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-blue-400'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        Drag & drop an audio file here, or click to select
      </p>
      <p className="text-xs text-gray-500">
        Supported formats: MP3, WAV, M4A
      </p>
    </div>
  );
};

export default VoiceUploader;