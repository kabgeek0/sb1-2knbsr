import React from 'react';
import { Volume2 } from 'lucide-react';
import { Voice } from '../types';

interface VoiceSelectorProps {
  voices: Voice[];
  selectedVoice: Voice | null;
  onVoiceSelect: (voice: Voice) => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  selectedVoice,
  onVoiceSelect,
}) => {
  const customVoices = voices.filter(voice => voice.isCustom);
  const presetVoices = voices.filter(voice => !voice.isCustom);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Volume2 className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-800">Choose a Voice</h2>
      </div>
      
      <div className="grid gap-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {customVoices.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500">Your Custom Voices</h3>
            {customVoices.map((voice) => (
              <div
                key={voice.voice_id}
                className={`voice-card ${selectedVoice?.voice_id === voice.voice_id ? 'selected' : ''}`}
                onClick={() => onVoiceSelect(voice)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">{voice.name}</span>
                    <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                      Custom
                    </div>
                  </div>
                  {voice.preview_url && (
                    <audio
                      src={voice.preview_url}
                      controls
                      className="w-full h-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500">Preset Voices</h3>
          {presetVoices.map((voice) => (
            <div
              key={voice.voice_id}
              className={`voice-card ${selectedVoice?.voice_id === voice.voice_id ? 'selected' : ''}`}
              onClick={() => onVoiceSelect(voice)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{voice.name}</span>
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                </div>
                {voice.preview_url && (
                  <audio
                    src={voice.preview_url}
                    controls
                    className="w-full h-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceSelector;