import React, { createContext, useState, useEffect, useMemo } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(Theme.Light);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Clean up all possible theme classes
    root.classList.remove(Theme.Light, Theme.Dark, Theme.Urban);
    // Add the current theme class
    root.classList.add(theme);

    // Set body background color for the area outside the main layout
    let bgColor = '';
    if (theme === Theme.Light) {
        bgColor = '#f9fafb'; // Corresponds to tailwind gray-50
    } else if (theme === Theme.Dark) {
        bgColor = '#111827'; // Corresponds to tailwind gray-900
    } else { // Urban theme
        bgColor = '#111111'; // Corresponds to theme urban bg-secondary
    }
    document.body.style.backgroundColor = bgColor;
    document.body.className = 'transition-colors duration-300';
    
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === Theme.Light) return Theme.Dark;
      if (prevTheme === Theme.Dark) return Theme.Urban;
      return Theme.Light; // Cycle from Urban back to Light
    });
  };
  
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
