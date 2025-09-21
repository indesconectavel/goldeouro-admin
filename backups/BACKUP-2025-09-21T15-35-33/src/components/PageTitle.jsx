import React from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

const PageTitle = ({ children, className = "", ...props }) => {
  const { device } = useDeviceDetection();
  
  // Tamanhos padronizados por dispositivo
  const getTitleSize = () => {
    if (device === 'mobile') {
      return 'text-xl'; // 20px
    } else if (device === 'tablet') {
      return 'text-2xl'; // 24px
    } else {
      return 'text-3xl'; // 30px
    }
  };

  const baseClasses = "font-bold text-yellow-400";
  const sizeClasses = getTitleSize();
  const combinedClasses = `${baseClasses} ${sizeClasses} ${className}`.trim();

  return (
    <h1 className={combinedClasses} {...props}>
      {children}
    </h1>
  );
};

export default PageTitle;
