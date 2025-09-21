// src/hooks/useRateLimit.js - Hook para rate limiting

import { useState, useEffect, useCallback } from 'react';
import { RateLimiter } from '../utils/validation';

// Instância global do rate limiter
const rateLimiter = new RateLimiter(10, 60000); // 10 requests por minuto

export function useRateLimit(identifier = 'default') {
  const [isAllowed, setIsAllowed] = useState(true);
  const [remainingRequests, setRemainingRequests] = useState(10);
  const [resetTime, setResetTime] = useState(0);

  const checkRateLimit = useCallback(() => {
    const allowed = rateLimiter.isAllowed(identifier);
    const remaining = rateLimiter.getRemainingRequests(identifier);
    const reset = rateLimiter.getResetTime(identifier);

    setIsAllowed(allowed);
    setRemainingRequests(remaining);
    setResetTime(reset);

    return allowed;
  }, [identifier]);

  const makeRequest = useCallback(async (requestFn) => {
    if (!checkRateLimit()) {
      throw new Error('Rate limit exceeded. Tente novamente em alguns minutos.');
    }

    try {
      const result = await requestFn();
      checkRateLimit(); // Atualizar contadores
      return result;
    } catch (error) {
      throw error;
    }
  }, [checkRateLimit]);

  // Atualizar contadores periodicamente
  useEffect(() => {
    const interval = setInterval(checkRateLimit, 1000);
    return () => clearInterval(interval);
  }, [checkRateLimit]);

  return {
    isAllowed,
    remainingRequests,
    resetTime,
    makeRequest,
    checkRateLimit
  };
}

export default useRateLimit;
