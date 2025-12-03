import React, { useState, useEffect, useCallback } from 'react';
import flashcardsData from '../data/flashcards.json';
import Flashcard from './Flashcard';
import { Filter, Shuffle, Layers, LayoutGrid, ChevronLeft, ChevronRight, Info, X } from 'lucide-react';
import { useKidMode } from '../context/KidModeContext';

const Home = () => {
  const [filter, setFilter] = useState('all');
  const [cards, setCards] = useState(flashcardsData);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'deck'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('hasSeenOnboarding');
  });
  const { isKidMode } = useKidMode();

  const categories = ['all', ...new Set(flashcardsData.map(c => c.category))];

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const handleFilter = (cat) => {
    setFilter(cat);
    if (cat === 'all') {
      setCards(flashcardsData);
    } else {
      setCards(flashcardsData.filter(c => c.category === cat));
    }
    setCurrentIndex(0); // Reset index on filter change
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const nextCard = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const prevCard = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  // Swipe Handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null); 
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextCard();
    }
    if (isRightSwipe) {
      prevCard();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (viewMode === 'deck') {
        if (e.key === 'ArrowRight') nextCard();
        if (e.key === 'ArrowLeft') prevCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, cards, nextCard, prevCard]);

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen transition-colors duration-500 ${isKidMode ? 'bg-yellow-50/50' : ''}`}>
      
      {/* Onboarding Tooltip */}
      {showOnboarding && (
        <div className="fixed bottom-4 left-4 right-4 md:bottom-8 md:right-8 md:left-auto max-w-sm bg-blue-600 text-white p-4 rounded-xl shadow-2xl z-50 animate-bounce-in">
          <div className="flex justify-between items-start gap-3">
             <Info className="w-6 h-6 shrink-0 mt-0.5" />
             <div className="flex-1">
                <h3 className="font-bold text-lg">Welcome!</h3>
                <p className="text-blue-100 text-sm mt-1">Tap a card to flip it. Swipe left or right in "Deck Mode" to study!</p>
             </div>
             <button onClick={dismissOnboarding} className="text-blue-200 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 sticky top-16 bg-gray-50/95 backdrop-blur z-40 py-4 -mx-4 px-4 md:static md:bg-transparent md:p-0 transition-all">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 no-scrollbar mask-gradient w-full md:w-auto">
          <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all flex-shrink-0 ${
                filter === cat 
                  ? `${isKidMode ? 'bg-orange-500 ring-orange-300' : 'bg-blue-600 ring-blue-200'} text-white shadow-md ring-2` 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
           <button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'deck' : 'grid')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm active:scale-95"
            title={viewMode === 'grid' ? "Switch to Deck View" : "Switch to Grid View"}
          >
            {viewMode === 'grid' ? <Layers className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
            <span className="hidden sm:inline">{viewMode === 'grid' ? 'Deck Mode' : 'Grid View'}</span>
          </button>

          <button 
            onClick={shuffleCards}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-100 text-amber-900 rounded-xl hover:bg-amber-200 transition-all font-medium shadow-sm active:scale-95"
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-white p-8 rounded-2xl shadow-sm inline-block">
             <p className="text-gray-500 text-lg">No cards found in this category.</p>
             <button onClick={() => handleFilter('all')} className="mt-4 text-blue-600 hover:underline">Show all cards</button>
          </div>
        </div>
      ) : (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8 justify-items-center pb-20 animate-in fade-in duration-500">
            {cards.map(card => (
              <Flashcard key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] pb-20 w-full max-w-md mx-auto">
            <div className="w-full mb-4 flex justify-between items-center text-gray-500 text-sm font-medium px-2">
              <span>Card {currentIndex + 1} of {cards.length}</span>
              <span className="uppercase tracking-wider text-xs bg-gray-100 px-2 py-1 rounded">{cards[currentIndex].category}</span>
            </div>

            <div 
              className="w-full relative touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
               <div className="animate-in zoom-in-95 duration-300">
                  <Flashcard key={cards[currentIndex].id} card={cards[currentIndex]} />
               </div>
               
               {/* Navigation Buttons (Desktop/Visual) */}
               <button 
                 onClick={prevCard}
                 className="absolute top-1/2 -left-12 md:-left-16 -translate-y-1/2 p-3 rounded-full bg-white shadow-lg text-gray-400 hover:text-blue-600 hover:scale-110 transition-all hidden md:block"
                 aria-label="Previous card"
               >
                 <ChevronLeft className="w-8 h-8" />
               </button>
               
               <button 
                 onClick={nextCard}
                 className="absolute top-1/2 -right-12 md:-right-16 -translate-y-1/2 p-3 rounded-full bg-white shadow-lg text-gray-400 hover:text-blue-600 hover:scale-110 transition-all hidden md:block"
                 aria-label="Next card"
               >
                 <ChevronRight className="w-8 h-8" />
               </button>
            </div>

            <div className="flex gap-8 mt-8 md:hidden">
               <button 
                 onClick={prevCard}
                 className="p-4 rounded-full bg-white shadow-md text-gray-500 active:scale-95 transition-transform"
               >
                 <ChevronLeft className="w-6 h-6" />
               </button>
               <button 
                 onClick={nextCard}
                 className="p-4 rounded-full bg-blue-600 shadow-md text-white active:scale-95 transition-transform"
               >
                 <ChevronRight className="w-6 h-6" />
               </button>
            </div>
            
            <p className="mt-6 text-gray-400 text-xs flex items-center gap-2">
              <Layers className="w-3 h-3" />
              Swipe left/right to navigate
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default Home;