import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../types';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const UrbanIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0v-4m6 4v-4m6 4v-4m-9-4h5M3 7h18" />
    </svg>
);

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const renderIcon = () => {
    switch (theme) {
      case Theme.Light:
        return <MoonIcon />; // Switch to Dark
      case Theme.Dark:
        return <UrbanIcon />; // Switch to Urban
      case Theme.Urban:
        return <SunIcon />; // Switch to Light
      default:
        return null;
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-theme-text-muted hover:bg-theme-bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary"
      aria-label="Toggle theme"
    >
      {renderIcon()}
    </button>
  );
};

export default ThemeSwitcher;
