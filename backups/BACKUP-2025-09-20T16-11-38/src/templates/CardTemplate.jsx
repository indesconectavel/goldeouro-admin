// TEMPLATE PARA CARDS PADRONIZADOS
// Baseado no padrão das páginas funcionais

export default function CardTemplate({ 
  title, 
  value, 
  color = "yellow", 
  icon, 
  className = "" 
}) {
  const colorClasses = {
    yellow: "border-yellow-500/20 text-yellow-300",
    green: "border-green-500/20 text-green-300", 
    red: "border-red-500/20 text-red-300",
    blue: "border-blue-500/20 text-blue-300",
    white: "border-white/20 text-gray-300"
  };

  const valueColorClasses = {
    yellow: "text-yellow-400",
    green: "text-green-400",
    red: "text-red-400", 
    blue: "text-blue-400",
    white: "text-white"
  };

  return (
    <div className={`card p-6 text-center border ${colorClasses[color]} ${className}`}>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${valueColorClasses[color]}`}>
        {value}
      </p>
      {icon && (
        <div className="mt-2 text-2xl">
          {icon}
        </div>
      )}
    </div>
  );
}
