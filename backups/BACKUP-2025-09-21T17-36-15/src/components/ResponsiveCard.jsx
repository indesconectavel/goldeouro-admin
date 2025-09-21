import React from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { getCardConfig, DESIGN_SYSTEM } from '../config/designSystem';

// Card responsivo padronizado baseado no Dashboard
const ResponsiveCard = ({ 
  title, 
  value, 
  icon, 
  className = "",
  onClick,
  hover = true,
  children 
}) => {
  const { device } = useDeviceDetection();
  const config = getCardConfig(device);
  
  const cardClasses = `
    ${DESIGN_SYSTEM.layout.card} 
    ${config.padding} 
    ${hover ? DESIGN_SYSTEM.layout.cardHover : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim();

  return (
    <div className={cardClasses} onClick={onClick}>
      {icon && (
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-2">{icon}</span>
          <h3 className={`${config.titleSize} font-semibold text-yellow-400`}>
            {title}
          </h3>
        </div>
      )}
      {!icon && title && (
        <h3 className={`${config.titleSize} font-semibold text-yellow-400 mb-2`}>
          {title}
        </h3>
      )}
      {value && (
        <p className={`${config.valueSize} font-bold text-white`}>
          {value}
        </p>
      )}
      {children}
    </div>
  );
};

// Card de estatística específico
export const StatCard = ({ title, value, icon, trend, className = "" }) => {
  const { device } = useDeviceDetection();
  const config = getCardConfig(device);

  return (
    <ResponsiveCard 
      title={title} 
      value={value} 
      icon={icon} 
      className={className}
    >
      {trend && (
        <div className="mt-2 flex items-center">
          <span className={`text-xs ${
            trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-gray-400'
          }`}>
            {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
          </span>
        </div>
      )}
    </ResponsiveCard>
  );
};

// Card de seção com título
export const SectionCard = ({ title, children, className = "" }) => {
  const { device } = useDeviceDetection();
  const config = getCardConfig(device);

  return (
    <div className={`${DESIGN_SYSTEM.layout.card} ${className}`}>
      <div className="px-4 py-3 border-b border-gray-700">
        <h3 className={`${config.titleSize} font-semibold text-yellow-400`}>
          {title}
        </h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveCard;
