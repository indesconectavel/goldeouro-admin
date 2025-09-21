// ESTADO VAZIO PADRONIZADO PARA TODAS AS PÁGINAS
// Baseado no padrão das páginas funcionais

export default function EmptyState({ message = "Nenhum dado disponível" }) {
  return (
    <div className="space-y-6">
      <div className="text-center text-gray-400">{message}</div>
    </div>
  );
}
