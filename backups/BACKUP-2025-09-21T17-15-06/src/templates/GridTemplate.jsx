// TEMPLATE PARA GRIDS RESPONSIVOS
// Baseado no padrão das páginas funcionais

export default function GridTemplate({ 
  children, 
  cols = { sm: 2, lg: 4 }, 
  gap = 6,
  className = "" 
}) {
  const gridClasses = `grid grid-cols-1 sm:grid-cols-${cols.sm} lg:grid-cols-${cols.lg} gap-${gap}`;
  
  return (
    <div className={`${gridClasses} ${className}`}>
      {children}
    </div>
  );
}
