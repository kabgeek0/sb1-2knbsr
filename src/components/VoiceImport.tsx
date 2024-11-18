import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import VoiceUploader from './VoiceUploader';
import VoiceRecorder from './VoiceRecorder';
import { CustomVoice } from '../types';

interface VoiceImportProps {
  onVoiceImported: (voice: CustomVoice) => void;
}

const VoiceImport: React.FC<VoiceImportProps> = ({ onVoiceImported }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [voiceName, setVoiceName] = useState('');

  const handleFileSelected = (file: File) => {
    setAudioFile(file);
    toast.success('Audio file selected successfully');
  };

  const handleRecordingComplete = (audioBlob: Blob) => {
    const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
    setAudioFile(file);
    toast.success('Recording saved successfully');
  };

  const handleImport = async () => {
    if (!audioFile) {
      toast.error('Please provide an audio file');
      return;
    }

    if (!voiceName.trim()) {
      toast.error('Please provide a name for your voice');
      return;
    }

    setIsProcessing(true);
    try {
      // Create a temporary URL for the audio preview
      const previewUrl = URL.createObjectURL(audioFile);
      
      // Create a custom voice object
      const customVoice: CustomVoice = {
        id: `custom-${Date.now()}`,
        name: voiceName,
        audioFile,
        previewUrl,
      };

      // Simulate API processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onVoiceImported(customVoice);
      toast.success('Voice model imported successfully!');
      
      // Reset form
      setAudioFile(null);
      setVoiceName('');
    } catch (error) {
      toast.error('Failed to import voice model');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Upload className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-800">Import Voice Model</h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <p>Choose one of the following methods to provide your voice sample:</p>
          </div>
          
          <div className="grid gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Record Voice</h3>
              <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Upload Audio File</h3>
              <VoiceUploader onFileSelected={handleFileSelected} />
            </div>
          </div>
        </div>

        {audioFile && (
          <div className="space-y-4">
            <div className="card p-4 bg-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm text-blue-700">
                  Selected: {audioFile.name}
                </span>
              </div>
            </div>

            <div className="card p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice Name
              </label>
              <input
                type="text"
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                placeholder="Enter a name for your voice"
                className="input-field"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={isProcessing || !audioFile || !voiceName.trim()}
          className="btn-primary w-full"
        >
          {isProcessing ? 'Processing...' : 'Import Voice Model'}
        </button>
      </div>
    </div>
  );
};

export default VoiceImport;