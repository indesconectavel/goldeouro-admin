export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4 text-yellow-600">
          Painel Administrativo
        </h1>
        <p className="mb-6 text-gray-700">
          Bem-vindo ao sistema de controle do jogo <span className="font-semibold">Gol de Ouro ⚽</span>
        </p>

        <div className="flex flex-col gap-4">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded transition">
            Ver Relatórios
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-4 rounded transition">
            Gerenciar Fila
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition">
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
