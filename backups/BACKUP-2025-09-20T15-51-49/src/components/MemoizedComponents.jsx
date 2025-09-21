import React, { memo } from 'react';

// Componente MemoizedStatCard para otimização de performance
const MemoizedStatCard = memo(({ title, value, icon, className = '' }) => {
  return (
    <div className={`card p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className="text-3xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
});

MemoizedStatCard.displayName = 'MemoizedStatCard';

export { MemoizedStatCard };
