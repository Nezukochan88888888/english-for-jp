import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AudioToggle = () => {
  const [muted, setMuted] = useState(() => {
    return JSON.parse(localStorage.getItem('audioMuted') || 'false');
  });

  useEffect(() => {
    localStorage.setItem('audioMuted', JSON.stringify(muted));
    // Dispatch custom event so other components can listen
    window.dispatchEvent(new CustomEvent('audio-toggle', { detail: muted }));
  }, [muted]);

  return (
    <button 
      onClick={() => setMuted(!muted)}
      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
      aria-label={muted ? "Unmute Audio" : "Mute Audio"}
      title={muted ? "Unmute Audio" : "Mute Audio"}
    >
      {muted ? <VolumeX className="w-5 h-5 text-gray-500" /> : <Volume2 className="w-5 h-5 text-blue-600" />}
    </button>
  );
};

export default AudioToggle;
