import { useState, useEffect } from 'react';

// Hook para detecção de dispositivo com breakpoints modernos
export const useDeviceDetection = () => {
  const [device, setDevice] = useState('desktop');
  const [isLoading, setIsLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });
      
      // Breakpoints modernos (2024-2025)
      if (width < 640) {
        setDevice('mobile');
      } else if (width < 1024) {
        setDevice('tablet');
      } else {
        setDevice('desktop');
      }
      
      setIsLoading(false);
    };

    // Verificação inicial
    checkDevice();
    
    // Listener para mudanças de tamanho
    window.addEventListener('resize', checkDevice);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Propriedades derivadas
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';
  const isDesktop = device === 'desktop';
  
  // Breakpoints específicos
  const isSmallMobile = windowSize.width < 375;
  const isLargeMobile = windowSize.width >= 375 && windowSize.width < 640;
  const isSmallTablet = windowSize.width >= 640 && windowSize.width < 768;
  const isLargeTablet = windowSize.width >= 768 && windowSize.width < 1024;

  return {
    device,
    isLoading,
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isSmallMobile,
    isLargeMobile,
    isSmallTablet,
    isLargeTablet,
    // Informações para debug
    debug: {
      width: windowSize.width,
      height: windowSize.height,
      device,
      breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
    }
  };
};

// Hook simplificado para casos básicos
export const useIsMobile = () => {
  const { isMobile } = useDeviceDetection();
  return isMobile;
};

export const useIsTablet = () => {
  const { isTablet } = useDeviceDetection();
  return isTablet;
};

export const useIsDesktop = () => {
  const { isDesktop } = useDeviceDetection();
  return isDesktop;
};
