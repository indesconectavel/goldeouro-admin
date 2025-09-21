import React from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { getCardConfig, DESIGN_SYSTEM } from '../config/designSystem';

// Grid responsivo padronizado baseado no Dashboard
const ResponsiveGrid = ({ 
  children, 
  columns = 'auto', // 'auto' usa configuração do dispositivo
  gap = 'default',
  className = "",
  ...props 
}) => {
  const { device } = useDeviceDetection();
  const config = getCardConfig(device);
  
  // Determinar classes de grid
  const getGridClasses = () => {
    if (columns === 'auto') {
      return config.grid;
    }
    
    // Configurações customizadas
    const gridMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
    };
    
    return gridMap[columns] || config.grid;
  };
  
  // Determinar gap
  const getGapClasses = () => {
    if (gap === 'default') {
      return config.grid.split(' ')[1]; // Pega o gap da configuração
    }
    
    const gapMap = {
      'xs': 'gap-1',
      'sm': 'gap-2',
      'md': 'gap-4',
      'lg': 'gap-6',
      'xl': 'gap-8',
    };
    
    return gapMap[gap] || 'gap-4';
  };

  const gridClasses = `${getGridClasses()} ${getGapClasses()} ${className}`.trim();

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
};

// Grid específico para cards de estatísticas
export const StatsGrid = ({ children, className = "" }) => {
  return (
    <ResponsiveGrid 
      columns="auto" 
      gap="default" 
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
};

// Grid específico para cards de métricas
export const MetricsGrid = ({ children, className = "" }) => {
  return (
    <ResponsiveGrid 
      columns={4} 
      gap="md" 
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
};

// Grid específico para cards especiais (2 colunas em desktop)
export const SpecialGrid = ({ children, className = "" }) => {
  return (
    <ResponsiveGrid 
      columns={2} 
      gap="md" 
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
};

export default ResponsiveGrid;
