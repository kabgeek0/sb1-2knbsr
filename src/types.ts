export interface Voice {
  voice_id: string;
  name: string;
  preview_url?: string;
  isCustom?: boolean;
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
}

export interface CustomVoice {
  id: string;
  name: string;
  audioFile: File;
  previewUrl: string;
}