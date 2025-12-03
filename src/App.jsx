import React, { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import AudioToggle from './components/AudioToggle';
import BottomNav from './components/BottomNav';
import { GraduationCap, Loader2, Smile, Moon, Sun, Maximize, Minimize } from 'lucide-react';
import { KidModeProvider, useKidMode } from './context/KidModeContext';

// Lazy load components
const Home = lazy(() => import('./components/Home'));
const AlphabetPage = lazy(() => import('./components/AlphabetPage'));
const TeacherGuide = lazy(() => import('./components/TeacherGuide'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
  </div>
);

const Navigation = ({ lang, setLang, isDark, setIsDark, toggleFullScreen }) => {
  const location = useLocation();
  const { isKidMode, setIsKidMode } = useKidMode();

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 border-b backdrop-blur-md ${
      isKidMode 
        ? 'border-yellow-400 bg-white/95' 
        : 'border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center shrink-0">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className={`p-1.5 sm:p-2 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110 ${isKidMode ? 'bg-gradient-to-br from-yellow-400 to-orange-500 rotate-3' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
               <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className={`text-lg sm:text-xl font-bold tracking-tight truncate ${isKidMode ? 'font-comic text-orange-500' : 'text-gray-900 dark:text-white'}`}>
              English<span className={isKidMode ? 'text-green-500' : 'text-blue-600'}>ForJP</span>
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl mx-4">
          <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/') ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
            Flashcards
          </Link>
          <Link to="/alphabet" className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/alphabet') ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
            Alphabet
          </Link>
          <Link to="/teacher" className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive('/teacher') ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
            Teacher
          </Link>
        </nav>

        {/* Mobile/Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
           {/* Kid Mode Toggle */}
           <button
             onClick={() => setIsKidMode(!isKidMode)}
             className={`p-1.5 sm:p-2 rounded-full transition-all active:scale-90 ${isKidMode ? 'bg-yellow-100 text-yellow-600 ring-2 ring-yellow-300 scale-110 shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
             title="Kid Mode"
           >
             <Smile className="w-5 h-5 sm:w-5 sm:h-5" />
           </button>
           
           {/* Dark Mode Toggle */}
           <button
             onClick={() => {
                setIsDark(!isDark);
                document.documentElement.classList.toggle('dark');
             }}
             className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-90"
           >
             {isDark ? <Sun className="w-5 h-5 sm:w-5 sm:h-5" /> : <Moon className="w-5 h-5 sm:w-5 sm:h-5" />}
           </button>

           {/* Language Toggle */}
           <button 
             onClick={() => setLang(lang === 'en' ? 'ja' : 'en')} 
             className="text-xs font-bold border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition uppercase tracking-wider shadow-sm active:scale-95 text-gray-700 dark:text-gray-300 min-w-[36px] text-center"
           >
             {lang === 'en' ? 'EN' : 'JP'}
           </button>
           
           <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-0.5 hidden sm:block"></div>
           <AudioToggle />
           
           {/* Full Screen Toggle (Desktop) */}
           <button 
             onClick={toggleFullScreen}
             className="p-1.5 sm:p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden sm:block"
             title="Enter Full Screen"
           >
             <Maximize className="w-5 h-5" />
           </button>
        </div>
      </div>
    </header>
  );
};

function App() {
  const [lang, setLang] = useState('en');
  const [isDark, setIsDark] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullScreen(true);
      } catch (err) {
        console.error("Error attempting to enable full-screen mode:", err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <KidModeProvider>
      <Router>
        <div className={`min-h-screen font-sans selection:bg-blue-100 dark:selection:bg-blue-900 ${isFullScreen ? 'pb-0 bg-gray-100 dark:bg-gray-900' : 'pb-24 md:pb-0'} ${isDark ? 'dark' : ''}`}>
          
          {!isFullScreen && (
            <Navigation lang={lang} setLang={setLang} isDark={isDark} setIsDark={setIsDark} toggleFullScreen={toggleFullScreen} />
          )}

          <main className={isFullScreen ? 'h-screen overflow-hidden flex flex-col' : 'pt-4'}>
            {isFullScreen && (
              <button 
                onClick={toggleFullScreen}
                className="fixed top-4 right-4 z-50 p-3 bg-black/20 hover:bg-black/40 text-gray-500 hover:text-white rounded-full backdrop-blur-sm transition-all"
                title="Exit Full Screen"
              >
                <Minimize className="w-6 h-6" />
              </button>
            )}

            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home isFullScreen={isFullScreen} />} />
                <Route path="/alphabet" element={<AlphabetPage />} />
                <Route path="/teacher" element={<TeacherGuide />} />
              </Routes>
            </Suspense>
          </main>
          
          {!isFullScreen && <BottomNav />}
        </div>
      </Router>
    </KidModeProvider>
  );
}

export default App;