import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Type, Brain, BookOpen } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Learn' },
    { path: '/alphabet', icon: Type, label: 'Alphabet' },
    // { path: '/quiz', icon: Brain, label: 'Quiz' }, // Placeholder for future quiz route
    { path: '/teacher', icon: BookOpen, label: 'Teacher' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
      <div className="glass bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 px-6 py-2 flex justify-between items-center pb-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 scale-110'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`
            }
          >
            <item.icon className="w-6 h-6" strokeWidth={2.5} />
            <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
