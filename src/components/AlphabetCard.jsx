import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

const AlphabetCard = ({ letter }) => {
  const [imgError, setImgError] = useState(false);

  const playAudio = () => {
    const globalMuted = JSON.parse(localStorage.getItem('audioMuted') || 'false');
    if (globalMuted) return;

    const playTTS = () => {
       if ('speechSynthesis' in window) {
         const utterance = new SpeechSynthesisUtterance(letter.letter);
         utterance.lang = 'en-US';
         window.speechSynthesis.speak(utterance);
       }
    };

    const audio = new Audio(letter.audio);
    audio.play().catch(() => {
      // Fallback to TTS
      playTTS();
    });
  };

  return (
    <div 
      onClick={playAudio}
      className="bg-white border rounded-xl p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 border-b-4 border-blue-100 active:border-b active:translate-y-0"
    >
      <div className="flex items-baseline space-x-2 mb-2">
        <span className="text-5xl font-black text-blue-600">{letter.letter}</span>
        <span className="text-5xl font-medium text-gray-400">{letter.lower}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
        <Volume2 className="w-3 h-3" />
        {letter.noteJP}
      </div>
      {letter.strokeImage && (
         <div className="mt-2 w-16 h-16 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
           {!imgError ? (
             <img 
               src={letter.strokeImage} 
               alt="Stroke Order" 
               className="w-full h-full object-contain opacity-60" 
               onError={() => setImgError(true)} 
             />
           ) : (
             // Fallback: Large tracing-style letter
             <span className="text-4xl font-serif text-gray-200 select-none" aria-label="Tracing fallback">
               {letter.letter}
             </span>
           )}
         </div>
      )}
    </div>
  );
};

export default AlphabetCard;
