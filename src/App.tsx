import React, { useEffect, useState } from 'react';
import { Headphones, Wand2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { Voice, CustomVoice } from './types';
import { getVoices } from './services/api';
import VoiceSelector from './components/VoiceSelector';
import TextToSpeech from './components/TextToSpeech';
import VoiceImport from './components/VoiceImport';
import Auth from './components/Auth';
import { auth } from './firebase';

function App() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'generate' | 'import'>('generate');
  const [customVoices, setCustomVoices] = useState<Voice[]>([]);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadVoices = async () => {
      try {
        const availableVoices = await getVoices();
        setVoices(availableVoices);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load voices:', error);
        setLoading(false);
      }
    };

    loadVoices();
  }, []);

  const handleVoiceImported = (customVoice: CustomVoice) => {
    const newVoice: Voice = {
      voice_id: customVoice.id,
      name: customVoice.name,
      preview_url: customVoice.previewUrl,
      isCustom: true
    };

    setCustomVoices(prev => [...prev, newVoice]);
    setActiveTab('generate');
    setSelectedVoice(newVoice);
  };

  const allVoices = [...voices, ...customVoices];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'card !bg-white',
          duration: 3000,
        }} 
      />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4 p-2 card">
            <Wand2 className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              AI Voice Generator
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Transform your text into natural speech with our AI-powered voices
          </p>
        </div>

        <div className="mb-8">
          <Auth />
        </div>

        {user && (
          <>
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-lg p-1 bg-gray-100">
                <button
                  onClick={() => setActiveTab('generate')}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'generate'
                      ? 'bg-white shadow text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Generate Speech
                </button>
                <button
                  onClick={() => setActiveTab('import')}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'import'
                      ? 'bg-white shadow text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Import Voice
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center min-h-[400px] card p-8">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500" />
                  <div className="mt-4 text-gray-500 font-medium">Loading voices...</div>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-8">
                {activeTab === 'generate' ? (
                  <>
                    <div className="card p-6">
                      <VoiceSelector
                        voices={allVoices}
                        selectedVoice={selectedVoice}
                        onVoiceSelect={setSelectedVoice}
                      />
                    </div>
                    <div className="card p-6">
                      <TextToSpeech selectedVoice={selectedVoice} />
                    </div>
                  </>
                ) : (
                  <div className="lg:col-span-2 card p-6">
                    <VoiceImport onVoiceImported={handleVoiceImported} />
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Powered by ElevenLabs AI • {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;