import axios from 'axios';
import { Voice, CustomVoice } from '../types';

const API_BASE_URL = 'https://api.elevenlabs.io/v1';
const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

export const getVoices = async (): Promise<Voice[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/voices`, {
      headers: {
        'xi-api-key': API_KEY,
      },
    });

    return response.data.voices.map((voice: any) => ({
      voice_id: voice.voice_id,
      name: voice.name,
      preview_url: voice.preview_url,
    }));
  } catch (error: any) {
    console.error('Error fetching voices:', error.response?.data || error.message);
    throw new Error('Failed to fetch voices');
  }
};

export const generateSpeech = async (
  voiceId: string,
  text: string,
  stability: number = 0.5,
  similarityBoost: number = 0.75
): Promise<Blob> => {
  try {
    // Handle custom voices differently
    if (voiceId.startsWith('custom-')) {
      // For custom voices, we'll use a more specialized endpoint
      return await generateCustomVoiceSpeech(voiceId, text);
    }

    // For preset voices, use the standard ElevenLabs endpoint
    const response = await axios.post(
      `${API_BASE_URL}/text-to-speech/${voiceId}`,
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
      },
      {
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        responseType: 'blob',
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Speech generation error:', error.response?.data || error.message);
    throw new Error('Failed to generate speech');
  }
};

// Helper function to handle custom voice generation
const generateCustomVoiceSpeech = async (voiceId: string, text: string): Promise<Blob> => {
  try {
    // Here we would normally make an API call to a voice cloning service
    // For now, we'll create a simple text-to-speech response using the Web Speech API
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      
      // Convert Web Speech API output to blob
      const audioContext = new AudioContext();
      const mediaStreamDestination = audioContext.createMediaStreamDestination();
      
      // Create an audio element to capture the synthesized speech
      const audioElement = new Audio();
      const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        resolve(audioBlob);
      };

      // Start recording and play the utterance
      mediaRecorder.start();
      window.speechSynthesis.speak(utterance);

      utterance.onend = () => {
        mediaRecorder.stop();
        audioContext.close();
      };

      utterance.onerror = (error) => {
        reject(new Error('Speech synthesis failed'));
      };
    });
  } catch (error) {
    console.error('Custom voice generation error:', error);
    throw new Error('Failed to generate speech with custom voice');
  }
};