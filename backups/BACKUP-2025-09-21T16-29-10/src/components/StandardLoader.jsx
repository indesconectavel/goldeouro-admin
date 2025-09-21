// LOADER PADRONIZADO PARA TODAS AS PÁGINAS
// Baseado no padrão das páginas funcionais

export default function StandardLoader({ message = "Carregando..." }) {
  return (
    <div className="space-y-6">
      <div className="text-center text-yellow-400">{message}</div>
    </div>
  );
}
