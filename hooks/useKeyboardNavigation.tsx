"use client";
import { useCallback } from 'react';

/**
 * Hook personalizado para manejar la navegación con teclado
 * Evita que los botones internos de autocomplete reciban foco
 */
export const useKeyboardNavigation = () => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const { key, code } = e;
    
    if (key === "Enter") {
      e.preventDefault();
      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>(
          "input:not([readonly]):not([disabled]):not([data-skip-enter-nav]), select:not([disabled]):not([data-skip-enter-nav]), textarea:not([disabled]):not([data-skip-enter-nav]), button:not([disabled]):not([data-skip-enter-nav])"
        )
      ).filter(
        (el) => {
          // Verificaciones básicas de visibilidad
          if (el.offsetParent === null || 
              getComputedStyle(el).visibility === "hidden" ||
              el.getAttribute("aria-hidden") === "true" ||
              el.hasAttribute("data-skip-focus")) {
            return false;
          }

          // Excluir elementos con tabIndex -1 (botones internos de autocomplete)
          if (el.tabIndex === -1) {
            return false;
          }

          // Excluir botones específicos de autocomplete por contenedor
          if (el.closest('.MuiAutocomplete-endAdornment') ||
              el.closest('.MuiAutocomplete-clearIndicator') ||
              el.closest('.MuiAutocomplete-popupIndicator')) {
            return false;
          }

          // Excluir botones específicos por selector de clase
          if (el.matches('.MuiAutocomplete-endAdornment button') ||
              el.matches('.MuiIconButton[tabindex="-1"]') ||
              el.matches('button[aria-label*="Clear"]') ||
              el.matches('button[aria-label*="Open"]') ||
              el.matches('button[title*="Clear"]') ||
              el.matches('button[title*="Open"]')) {
            return false;
          }

          return true;
        }
      );
      const idx = focusable.indexOf(e.target as HTMLElement);
      const next = focusable[idx + 1];
      if (next) next.focus();
      return;
    }
    
    if (code === "NumpadAdd") {
      e.preventDefault();
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON") {
        (target as HTMLButtonElement).click();
        return;
      }
      const form = target.closest("form");
      const defaultBtn =
        form?.querySelector('button[type="submit"]') ||
        document.querySelector("button[data-default-action]");
      if (defaultBtn instanceof HTMLButtonElement) defaultBtn.click();
    }
  }, []);

  return { handleKeyDown };
};
