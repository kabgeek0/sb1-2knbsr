import React, { useState } from 'react';
import { Play, Type } from 'lucide-react';
import toast from 'react-hot-toast';
import { Voice } from '../types';
import { generateSpeech } from '../services/api';

interface TextToSpeechProps {
  selectedVoice: Voice | null;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ selectedVoice }) => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedVoice) {
      toast.error('Please select a voice first');
      return;
    }

    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }

    setIsGenerating(true);
    try {
      const audioBlob = await generateSpeech(selectedVoice.voice_id, text);
      // Revoke previous URL to prevent memory leaks
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      toast.success('Speech generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate speech. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Cleanup audio URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Type className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-800">Enter Your Text</h2>
      </div>

      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input-field h-40"
          placeholder="Type or paste your text here..."
        />

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !selectedVoice}
          className="btn-primary w-full"
        >
          <Play size={20} />
          {isGenerating ? 'Generating Speech...' : 'Generate Speech'}
        </button>

        {audioUrl && (
          <div className="card p-4">
            <audio
              controls
              className="w-full"
              src={audioUrl}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>

      {!selectedVoice && (
        <div className="text-sm text-gray-500 text-center">
          Select a voice from the list to get started
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;