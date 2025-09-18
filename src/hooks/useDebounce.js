import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * @param {any} value - Valor para debounce
 * @param {number} delay - Delay em milissegundos
 * @returns {any} - Valor com debounce aplicado
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook para debounce de funções
 * @param {Function} callback - Função para debounce
 * @param {number} delay - Delay em milissegundos
 * @returns {Function} - Função com debounce aplicado
 */
export const useDebouncedCallback = (callback, delay = 500) => {
  const [debouncedCallback, setDebouncedCallback] = useState(() => callback);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);

  return debouncedCallback;
};


