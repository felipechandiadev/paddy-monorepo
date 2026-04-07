"use client";

import { useState, useEffect } from 'react';

export function useSplashScreen(duration: number = 8500) {
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Verificar si es la primera carga de la sesión
    const hasShownSplash = sessionStorage.getItem('splashShown');
    
    if (hasShownSplash) {
      // Si ya se mostró el splash en esta sesión, no mostrarlo de nuevo
      setShowSplash(false);
      setIsFirstLoad(false);
    } else {
      // Primera carga, mostrar splash
      setIsFirstLoad(true);
      
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('splashShown', 'true');
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const hideSplash = () => {
    setShowSplash(false);
    sessionStorage.setItem('splashShown', 'true');
  };

  return {
    showSplash: showSplash && isFirstLoad,
    hideSplash,
    isFirstLoad,
  };
}
