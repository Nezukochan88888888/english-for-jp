import React, { useState, useEffect, useCallback } from 'react';
import flashcardsData from '../data/flashcards.json';
import Flashcard from './Flashcard';
import { Filter, Shuffle, Layers, LayoutGrid, ChevronLeft, ChevronRight, Info, X, Flame, Trophy, Target } from 'lucide-react';
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
    setCurrentIndex(0); 
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

  // Gamification Mock Data
  const dailyGoal = 75; // percentage
  const streak = 3;
  const xp = 1250;

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 transition-colors duration-500 ${isKidMode ? 'bg-yellow-50/50' : ''}`}>
      
      {/* Hero / Gamification Section */}
      <div className="mb-8 pt-4 animate-in slide-in-from-top-5 duration-500">
        <div className={`rounded-3xl p-6 shadow-xl relative overflow-hidden ${isKidMode ? 'bg-gradient-to-r from-orange-400 to-pink-500' : 'bg-gradient-to-r from-blue-600 to-indigo-700'}`}>
          
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>

          <div className="relative z-10 text-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">Hello, Student! 👋</h1>
                <p className="text-blue-100 text-sm font-medium opacity-90">Ready to learn some new words?</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 font-bold text-yellow-300">
                     <Flame className="w-5 h-5 fill-yellow-300" />
                     <span>{streak} Days</span>
                  </div>
                  <span className="text-xs text-blue-100 opacity-75">Streak</span>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1 font-bold text-purple-200">
                     <Trophy className="w-5 h-5" />
                     <span>{xp} XP</span>
                   </div>
                   <span className="text-xs text-blue-100 opacity-75">Total XP</span>
                </div>
              </div>
            </div>

            <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
               <div className="flex justify-between items-center mb-2 text-sm font-medium">
                 <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-400" />
                    <span>Daily Goal</span>
                 </div>
                 <span>{dailyGoal}%</span>
               </div>
               <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${dailyGoal}%` }}
                  ></div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Tooltip */}
      {showOnboarding && (
        <div className="fixed bottom-24 left-4 right-4 md:bottom-8 md:right-8 md:left-auto max-w-sm bg-blue-600 text-white p-4 rounded-xl shadow-2xl z-50 animate-bounce-in">
          <div className="flex justify-between items-start gap-3">
             <Info className="w-6 h-6 shrink-0 mt-0.5" />
             <div className="flex-1">
                <h3 className="font-bold text-lg">Welcome!</h3>
                <p className="text-blue-100 text-sm mt-1">Tap a card to flip it. Swipe in Deck Mode to study!</p>
             </div>
             <button onClick={dismissOnboarding} className="text-blue-200 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}

      {/* Controls & Filters */}
      <div className="sticky top-16 z-30 py-3 -mx-4 px-4 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 md:static md:bg-transparent md:border-none md:p-0 md:mx-0 transition-all mb-6 shadow-sm md:shadow-none">
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center max-w-7xl mx-auto">
          
          {/* Row 1: Filters */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 no-scrollbar mask-gradient w-full md:w-auto px-1">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-all flex-shrink-0 active:scale-95 ${
                  filter === cat 
                    ? `${isKidMode ? 'bg-orange-500 ring-orange-300' : 'bg-blue-600 ring-blue-200'} text-white shadow-lg shadow-blue-500/30` 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {/* Row 2: Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto">
             <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'deck' : 'grid')}
              className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-3 md:py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium shadow-sm active:scale-95"
            >
              {viewMode === 'grid' ? <Layers className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
              <span>{viewMode === 'grid' ? 'Deck Mode' : 'Grid View'}</span>
            </button>

            <button 
              onClick={shuffleCards}
              className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-3 md:py-2.5 bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-100 rounded-xl hover:bg-amber-200 dark:hover:bg-amber-900/70 transition-all font-medium shadow-sm active:scale-95"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle</span>
            </button>
          </div>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm inline-block">
             <p className="text-gray-500 dark:text-gray-400 text-lg">No cards found in this category.</p>
             <button onClick={() => handleFilter('all')} className="mt-4 text-blue-600 dark:text-blue-400 font-bold hover:underline">Show all cards</button>
          </div>
        </div>
      ) : (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 justify-items-center animate-in fade-in duration-500">
            {cards.map(card => (
              <div key={card.id} className="hover:-translate-y-2 hover:rotate-1 transition-transform duration-300 w-full max-w-sm">
                 <Flashcard card={card} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] w-full max-w-md mx-auto relative">
            <div className="w-full mb-4 flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm font-medium px-2">
              <span>Card {currentIndex + 1} of {cards.length}</span>
              <span className="uppercase tracking-wider text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{cards[currentIndex].category}</span>
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
               
               {/* Desktop Navigation Arrows */}
               <button 
                 onClick={prevCard}
                 className="absolute top-1/2 -left-12 md:-left-20 -translate-y-1/2 p-4 rounded-full bg-white dark:bg-gray-800 shadow-xl text-gray-400 hover:text-blue-600 hover:scale-110 transition-all hidden md:block"
               >
                 <ChevronLeft className="w-8 h-8" />
               </button>
               
               <button 
                 onClick={nextCard}
                 className="absolute top-1/2 -right-12 md:-right-20 -translate-y-1/2 p-4 rounded-full bg-white dark:bg-gray-800 shadow-xl text-gray-400 hover:text-blue-600 hover:scale-110 transition-all hidden md:block"
               >
                 <ChevronRight className="w-8 h-8" />
               </button>
            </div>

            {/* Mobile Navigation Controls */}
            <div className="flex gap-6 mt-8 md:hidden w-full justify-center">
               <button 
                 onClick={prevCard}
                 className="p-5 rounded-2xl bg-white dark:bg-gray-800 shadow-lg text-gray-500 dark:text-gray-300 active:scale-90 transition-transform border border-gray-100 dark:border-gray-700"
               >
                 <ChevronLeft className="w-6 h-6" />
               </button>
               <button 
                 onClick={nextCard}
                 className="p-5 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30 text-white active:scale-90 transition-transform"
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
