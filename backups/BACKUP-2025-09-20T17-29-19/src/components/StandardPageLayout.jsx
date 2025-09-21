import React from 'react';
import PageTitle from './PageTitle';
import { DESIGN_SYSTEM } from '../config/designSystem';

// Layout padrão para todas as páginas baseado no Dashboard
const StandardPageLayout = ({ 
  title, 
  description, 
  children, 
  className = "",
  showHeader = true 
}) => {
  return (
    <div className={`${DESIGN_SYSTEM.layout.container} ${className}`}>
      <div className={DESIGN_SYSTEM.layout.section}>
        {showHeader && (
          <div className={DESIGN_SYSTEM.layout.header}>
            <PageTitle>{title}</PageTitle>
            {description && (
              <p className={DESIGN_SYSTEM.typography.text.secondary}>
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default StandardPageLayout;
