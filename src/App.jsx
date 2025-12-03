import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import AudioToggle from './components/AudioToggle';
import { GraduationCap, Menu, X, Loader2, Smile } from 'lucide-react';
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

const Navigation = ({ lang, setLang }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isKidMode, setIsKidMode } = useKidMode();

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`bg-white border-b sticky top-0 z-50 transition-colors ${isKidMode ? 'border-b-4 border-yellow-400' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
            <div className={`p-2 rounded-lg transition ${isKidMode ? 'bg-yellow-400 rotate-3' : 'bg-blue-600 group-hover:bg-blue-700'}`}>
               <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${isKidMode ? 'font-comic text-orange-500' : 'text-gray-900'}`}>
              English<span className={isKidMode ? 'text-green-500' : 'text-blue-600'}>ForJP</span>
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            Flashcards
          </Link>
          <Link to="/alphabet" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/alphabet') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            Alphabet
          </Link>
          <Link to="/teacher" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/teacher') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            Teacher Guide
          </Link>
        </nav>

        <div className="flex items-center gap-3">
           {/* Kid Mode Toggle */}
           <button
             onClick={() => setIsKidMode(!isKidMode)}
             className={`p-2 rounded-full transition-all ${isKidMode ? 'bg-yellow-100 text-yellow-600 ring-2 ring-yellow-300 scale-110' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
             title="Kid Mode"
           >
             <Smile className="w-5 h-5" />
           </button>

           <button 
             onClick={() => setLang(lang === 'en' ? 'ja' : 'en')} 
             className="text-xs font-bold border bg-gray-50 px-2 py-1.5 rounded-md hover:bg-gray-100 transition uppercase tracking-wider w-16 text-center"
             aria-label={lang === 'en' ? 'Switch to Japanese' : 'Switch to English'}
           >
             {lang === 'en' ? '🇺🇸 EN' : '🇯🇵 JP'}
           </button>
           <div className="w-px h-6 bg-gray-200 mx-1"></div>
           <AudioToggle />
           
           <button 
             className="md:hidden ml-2 p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             aria-label="Toggle menu"
             aria-expanded={isMobileMenuOpen}
           >
             {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-64 border-t opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-gray-50 p-4 space-y-2">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`block px-4 py-3 rounded-lg ${isActive('/') ? 'bg-blue-100 text-blue-800' : 'bg-white shadow-sm'}`}>
             Flashcards
          </Link>
          <Link to="/alphabet" onClick={() => setIsMobileMenuOpen(false)} className={`block px-4 py-3 rounded-lg ${isActive('/alphabet') ? 'bg-blue-100 text-blue-800' : 'bg-white shadow-sm'}`}>
             Alphabet
          </Link>
          <Link to="/teacher" onClick={() => setIsMobileMenuOpen(false)} className={`block px-4 py-3 rounded-lg ${isActive('/teacher') ? 'bg-blue-100 text-blue-800' : 'bg-white shadow-sm'}`}>
             Teacher Guide
          </Link>
        </div>
      </div>
    </header>
  );
};

function App() {
  const [lang, setLang] = useState('en');

  return (
    <KidModeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-100">
          <Navigation lang={lang} setLang={setLang} />

          <main>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/alphabet" element={<AlphabetPage />} />
                <Route path="/teacher" element={<TeacherGuide />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </KidModeProvider>
  );
}

export default App;