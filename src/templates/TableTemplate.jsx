// TEMPLATE PARA TABELAS PADRONIZADAS
// Baseado no padrão das páginas funcionais

export default function TableTemplate({ 
  title, 
  columns, 
  data, 
  className = "" 
}) {
  if (!data || data.length === 0) {
    return (
      <div className="card p-6 border border-yellow-500/20">
        <h3 className="text-lg font-semibold text-yellow-400 mb-4">{title}</h3>
        <div className="text-center text-gray-400">Nenhum dado disponível</div>
      </div>
    );
  }

  return (
    <div className={`card p-6 border border-yellow-500/20 ${className}`}>
      <h3 className="text-lg font-semibold text-yellow-400 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-yellow-500/20">
              {columns.map((column, index) => (
                <th key={index} className="text-left py-2 text-yellow-300">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={row.id != null ? String(row.id) : rowIndex} className="border-b border-yellow-500/10">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="py-2 text-white">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
