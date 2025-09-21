import React from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { DESIGN_SYSTEM } from '../config/designSystem';

// Tabela responsiva padronizada baseada no Dashboard
const ResponsiveTable = ({ 
  columns = [], 
  data = [], 
  className = "",
  mobileView = 'cards', // 'cards' ou 'scroll'
  emptyMessage = 'Nenhum dado encontrado',
  onRowClick,
  ...props 
}) => {
  const { device, isMobile } = useDeviceDetection();

  // Renderizar como cards no mobile
  if (isMobile && mobileView === 'cards') {
    return (
      <div className="space-y-3">
        {data.length > 0 ? (
          data.map((row, index) => (
            <div 
              key={index}
              className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => onRowClick?.(row, index)}
            >
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="flex justify-between items-center mb-2 last:mb-0">
                  <span className="text-sm font-medium text-gray-300">
                    {column.label}:
                  </span>
                  <span className="text-sm text-white">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>{emptyMessage}</p>
          </div>
        )}
      </div>
    );
  }

  // Renderizar como tabela tradicional
  return (
    <div className="overflow-x-auto">
      <table className={`w-full min-w-[600px] ${className}`} {...props}>
        <thead className="bg-gray-700">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index}
                className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr 
                key={index}
                className="hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => onRowClick?.(row, index)}
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex}
                    className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-white"
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={columns.length} 
                className="px-6 py-8 text-center text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Componente para status badges
export const StatusBadge = ({ status, type = 'default' }) => {
  const getStatusClasses = () => {
    const statusMap = {
      active: 'bg-green-500 text-white',
      waiting: 'bg-yellow-500 text-white',
      finished: 'bg-red-500 text-white',
      pending: 'bg-gray-500 text-white',
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-yellow-500 text-white',
      info: 'bg-blue-500 text-white',
    };
    
    return statusMap[status] || DESIGN_SYSTEM.status[type] || 'bg-gray-500 text-white';
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${getStatusClasses()}`}>
      {status}
    </span>
  );
};

// Componente para valores monetários
export const CurrencyValue = ({ value, currency = 'R$', className = "" }) => {
  const formatValue = (val) => {
    if (typeof val !== 'number') return val;
    return val.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <span className={`${DESIGN_SYSTEM.typography.value.medium} ${className}`}>
      {currency} {formatValue(value)}
    </span>
  );
};

// Componente para valores numéricos
export const NumberValue = ({ value, className = "" }) => {
  const formatValue = (val) => {
    if (typeof val !== 'number') return val;
    return val.toLocaleString('pt-BR');
  };

  return (
    <span className={`${DESIGN_SYSTEM.typography.value.medium} ${className}`}>
      {formatValue(value)}
    </span>
  );
};

export default ResponsiveTable;