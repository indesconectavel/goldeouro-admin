import React from 'react';
import { isFeatureEnabled } from '../config/featureFlags';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

// Componente wrapper que controla quando usar versão responsiva ou original
const ResponsiveWrapper = ({ 
  children, 
  fallback, 
  featureName,
  desktopFallback = null,
  forceResponsive = false
}) => {
  const { device, isLoading } = useDeviceDetection();
  
  // Loading state
  if (isLoading) {
    return (
      <div className="w-64 h-screen bg-gray-800 animate-pulse">
        <div className="p-6">
          <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  // Desktop sempre usa versão original (validada) se não forçado
  if (device === 'desktop' && desktopFallback && !forceResponsive) {
    return desktopFallback;
  }

  // Feature flag desabilitado = fallback para versão original
  if (!isFeatureEnabled(featureName) && !forceResponsive) {
    return fallback;
  }

  // Feature flag habilitado = versão responsiva
  return children;
};

export default ResponsiveWrapper;
