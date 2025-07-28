import { postData } from './api';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4 text-yellow-600">
          Painel Administrativo
        </h1>
        <p className="mb-6 text-gray-700">
          Bem-vindo ao sistema de controle do jogo <span className="font-semibold">Gol de Ouro ⚽</span>
        </p>

        <div className="flex flex-col gap-4">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded transition"
            onClick={async () => {
              const result = await postData('/admin/relatorio-semanal', {});
              alert(JSON.stringify(result, null, 2));
            }}
          >
            Ver Relatórios
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
            onClick={async () => {
              const result = await postData('/admin/controle-fila', {});
              alert(JSON.stringify(result, null, 2));
            }}
          >
            Gerenciar Fila
          </button>

          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition"
            onClick={async () => {
              const result = await postData('/admin/estatisticas', {});
              alert(JSON.stringify(result, null, 2));
            }}
          >
            Ver Estatísticas
          </button>

          <button
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded transition"
            onClick={async () => {
              const result = await postData('/admin/top-jogadores', {});
              alert(JSON.stringify(result, null, 2));
            }}
          >
            Top Jogadores
          </button>

          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition"
            onClick={async () => {
              const result = await postData('/admin/transacoes-recentes', {});
              alert(JSON.stringify(result, null, 2));
            }}
          >
            Transações Recentes
          </button>

          <button
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded transition"
            onClick={async () => {
              const result = await postData('/admin/chutes-recentes', {});
              alert(JSON.stringify(result, null, 2));
            }}
          >
            Chutes Recentes
          </button>

          <button
            className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded transition"
            onClick={async () => {
              const result = await postData('/admin/relatorio-usuarios', {});
              alert(JSON.stringify(result, null, 2));
            }}
          >
            Relatório por Usuário
          </button>

          <button
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded transition"
            onClick={async () => {
              const result = await postData('/admin/usuarios', {});
              alert(JSON.stringify(result, null, 2));
            }}
          >
            Todos os Usuários
          </button>

          <button
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition"
            onClick={async () => {
              const result = await postData('/admin/logs', {});
              alert(JSON.stringify(result, null, 2));
            }}
          >
            Logs do Sistema
          </button>

          <button
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition"
            onClick={async () => {
              const result = await postData('/admin/usuarios-bloqueados', {});
              alert(JSON.stringify(result, null, 2));
            }}
          >
            Usuários Bloqueados
          </button>

          <button
            className="bg-lime-600 hover:bg-lime-700 text-white font-semibold py-2 px-4 rounded transition"
            onClick={async () => {
              const result = await postData('/admin/backup-status', {});
              alert(JSON.stringify(result, null, 2));
            }}
          >
            Status do Backup
          </button>

          <button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
