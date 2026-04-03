import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Sun,
  Moon,
  Droplet,
  Flame,
  Rose,
  Sparkles,
} from 'lucide-react';

const THEMES = [
  {
    name: 'Indigo Purple',
    value: 'current',
    icon: <Palette className="w-5 h-5" />,
    colors: 'bg-gradient-to-br from-indigo-600 to-purple-600',
  },
  {
    name: 'Ocean Blue',
    value: 'ocean',
    icon: <Droplet className="w-5 h-5" />,
    colors: 'bg-gradient-to-br from-blue-600 to-cyan-600',
  },
  {
    name: 'Emerald Forest',
    value: 'emerald',
    icon: <Sparkles className="w-5 h-5" />,
    colors: 'bg-gradient-to-br from-emerald-600 to-green-600',
  },
  {
    name: 'Sunset Orange',
    value: 'sunset',
    icon: <Sun className="w-5 h-5" />,
    colors: 'bg-gradient-to-br from-orange-600 to-red-600',
  },
  {
    name: 'Rose Pink',
    value: 'rose',
    icon: <Rose className="w-5 h-5" />,
    colors: 'bg-gradient-to-br from-pink-600 to-rose-600',
  },
  {
    name: 'Deep Purple',
    value: 'deepPurple',
    icon: <Moon className="w-5 h-5" />,
    colors: 'bg-gradient-to-br from-purple-600 to-indigo-600',
  },
];

const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState('current');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('evalora-theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const handleThemeChange = (themeValue) => {
    setCurrentTheme(themeValue);
    localStorage.setItem('evalora-theme', themeValue);
    
    alert(`Theme changed to ${themeValue}!\n\nTo apply this theme:\n1. Stop the dev server (Ctrl+C)\n2. Edit tailwind.config.js\n3. Change 'const selectedTheme = THEMES.current' to 'THEMES.${themeValue}'\n4. Restart the dev server`);
    setIsOpen(false);
  };

  const selectedTheme = THEMES.find(t => t.value === currentTheme);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-dark border border-slate-700/50 hover:bg-slate-700/80 transition-all duration-200"
        >
          <div className={`w-6 h-6 rounded-lg ${selectedTheme?.colors || 'bg-gradient-to-br from-indigo-600 to-purple-600'}`}>
            {selectedTheme?.icon || <Palette className="w-4 h-4 text-white" />}
          </div>
          <span className="text-sm text-white font-medium">{selectedTheme?.name || 'Theme'}</span>
          <Palette className="w-4 h-4 text-slate-400" />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-12 right-0 w-64 glass-dark border border-slate-700/50 rounded-xl shadow-2xl z-50"
              >
                <div className="p-2 space-y-1">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Choose Theme</p>
                  {THEMES.map((theme) => (
                    <motion.button
                      key={theme.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleThemeChange(theme.value)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentTheme === theme.value
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded ${theme.colors}`}>
                        <div className="w-full h-full rounded flex items-center justify-center">
                          {theme.icon}
                        </div>
                      </div>
                      <span>{theme.name}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ThemeSwitcher;
