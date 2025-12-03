import React, { useState } from 'react';
import { Play, RotateCw, Volume2, Languages } from 'lucide-react';
import { useKidMode } from '../context/KidModeContext';

const Flashcard = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingJa, setIsPlayingJa] = useState(false);
  const [imgSrc, setImgSrc] = useState(card.image);
  const [hasError, setHasError] = useState(false);
  const { isKidMode } = useKidMode();

  const playAudio = (e, lang = 'en') => {
    e.stopPropagation();
    const globalMuted = JSON.parse(localStorage.getItem('audioMuted') || 'false');
    if (globalMuted) return;

    const isJa = lang === 'ja';
    if (isJa) setIsPlayingJa(true);
    else setIsPlaying(true);

    const playTTS = () => {
      if ('speechSynthesis' in window) {
        const text = isJa ? card.japanese.kana : card.english;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = isJa ? 'ja-JP' : 'en-US';
        utterance.rate = isKidMode ? 0.6 : 0.8; // Slower for clarity (0.8 standard, 0.6 kid mode)
        utterance.onend = () => isJa ? setIsPlayingJa(false) : setIsPlaying(false);
        utterance.onerror = () => isJa ? setIsPlayingJa(false) : setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      } else {
        isJa ? setIsPlayingJa(false) : setIsPlaying(false);
      }
    };

    // For English, try file first. For Japanese, use TTS for now (unless file exists in future)
    if (!isJa && card.audio) {
      const audio = new Audio(card.audio);
      audio.play()
        .then(() => {
          audio.onended = () => setIsPlaying(false);
        })
        .catch((err) => {
          console.log("Audio file not found, fallback to TTS", err);
          playTTS();
        });
    } else {
      playTTS();
    }
  };

  const handleImageError = () => {
    if (!hasError) {
      setImgSrc(`https://placehold.co/300x200/f1f5f9/475569.png?text=${encodeURIComponent(card.english)}`);
      setHasError(true);
    }
  };

  // Color coding based on POS
  const getPosColor = (pos) => {
    switch (pos) {
      case 'noun': return isKidMode ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white';
      case 'verb': return isKidMode ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white';
      case 'adjective': return isKidMode ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white';
      default: return isKidMode ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white';
    }
  };

  const containerClasses = isKidMode 
    ? `rounded-[2rem] shadow-xl border-4 ${getPosColor(card.pos)}` 
    : `rounded-2xl shadow-lg border-2 border-gray-200 bg-white`;

  return (
    <div 
      className="relative w-full max-w-[320px] h-[28rem] perspective cursor-pointer group mx-auto selection:bg-none"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`w-full h-full transition-transform duration-500 transform-style-3d ${containerClasses} ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front */}
        <div className={`absolute w-full h-full backface-hidden flex flex-col items-center justify-between p-6 overflow-hidden z-20 rounded-[inherit] ${isKidMode ? 'bg-white/50' : 'bg-white'}`}>
          <div className={`absolute top-4 right-4 text-xs font-bold tracking-wider px-2 py-1 rounded-full uppercase ${isKidMode ? 'bg-white border-2 border-current text-gray-500' : 'bg-gray-50 border border-gray-200 text-gray-400'}`}>
            {card.pos}
          </div>
          
          <div className="w-full flex-1 flex items-center justify-center my-2 overflow-hidden rounded-xl">
             <img 
               src={imgSrc} 
               alt={card.english} 
               loading="lazy"
               className="max-h-60 w-full object-contain transition-transform duration-300 group-hover:scale-105" 
               onError={handleImageError}
             />
          </div>

          <div className="text-center w-full mt-2">
            <h2 className={`font-bold text-gray-800 mb-1 truncate px-2 ${isKidMode ? 'text-4xl font-comic' : 'text-3xl'}`} title={card.english}>
              {card.english}
            </h2>
            <p className="text-gray-500 font-mono bg-gray-100/80 px-3 py-1 rounded-full inline-block text-sm">
              {card.phonetic}
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 w-full justify-center">
            <button 
              onClick={(e) => playAudio(e, 'en')} 
              className={`p-4 rounded-full shadow-sm border transition-all duration-200 ${
                isPlaying 
                  ? 'bg-green-100 text-green-600 border-green-300 scale-110 ring-4 ring-green-100' 
                  : 'bg-white text-blue-600 border-gray-100 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 hover:scale-105'
              }`}
              aria-label="Play English Audio"
            >
              {isPlaying ? <Volume2 className="w-8 h-8 animate-pulse" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
          </div>
          
          <div className="absolute bottom-4 right-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <RotateCw className="w-6 h-6" />
          </div>
        </div>

        {/* Back */}
        <div className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-[inherit] flex flex-col items-center p-6 text-center border-2 border-amber-100 overflow-hidden z-20 ${isKidMode ? 'bg-amber-50' : 'bg-amber-50'}`}>
          <div className="flex-1 flex flex-col justify-center w-full items-center">
            <h3 className={`mb-3 text-gray-900 font-serif break-words w-full leading-tight ${isKidMode ? 'text-6xl' : 'text-5xl'}`}>
              {card.japanese.kanji}
            </h3>
            <p className={`text-gray-700 mb-1 font-medium ${isKidMode ? 'text-2xl' : 'text-xl'}`}>
              {card.japanese.kana}
            </p>
            <p className="text-sm text-gray-400 mb-8 tracking-[0.2em] uppercase font-semibold">
              {card.japanese.romaji}
            </p>

             {/* Japanese Audio Button */}
            <button 
              onClick={(e) => playAudio(e, 'ja')} 
              className={`p-4 rounded-full shadow-sm border transition-all duration-200 mb-6 ${
                isPlayingJa 
                  ? 'bg-red-100 text-red-600 border-red-300 scale-110 ring-4 ring-red-100' 
                  : 'bg-white text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200 hover:scale-105'
              }`}
              aria-label="Play Japanese Audio"
            >
               {isPlayingJa ? <Volume2 className="w-8 h-8 animate-pulse" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
          </div>
          
          {card.example && (
            <div className="text-sm bg-white/80 p-4 rounded-xl border border-amber-200/50 w-full mt-auto shadow-sm backdrop-blur-sm">
              <p className="text-gray-800 italic mb-2 leading-snug font-medium">"{card.example.en}"</p>
              <div className="h-px w-12 bg-amber-200 mx-auto mb-2"></div>
              <p className="text-gray-600 font-jp leading-snug text-xs">{card.example.ja}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
