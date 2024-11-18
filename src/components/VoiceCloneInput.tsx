import React from 'react';

interface VoiceCloneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const VoiceCloneInput: React.FC<VoiceCloneInputProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Voice Clone Text
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-24"
        placeholder="Enter the text that matches your voice recording..."
      />
      <p className="mt-1 text-xs text-gray-500">
        This text should match what you say in your voice recording
      </p>
    </div>
  );
};

export default VoiceCloneInput;