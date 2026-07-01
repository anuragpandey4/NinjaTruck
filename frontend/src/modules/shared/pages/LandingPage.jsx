import React, { useState, useEffect } from 'react';
import LandingPageLight from './LandingPageLight';
import LandingPageDark from './LandingPageDark';

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('landing_theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('landing_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <div className="relative">
      {isDarkMode ? (
        <LandingPageDark toggleTheme={toggleTheme} />
      ) : (
        <LandingPageLight toggleTheme={toggleTheme} />
      )}
    </div>
  );
}
