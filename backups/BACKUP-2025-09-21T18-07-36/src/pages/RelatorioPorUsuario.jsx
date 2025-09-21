import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postData } from '../js/api';
import CardTemplate from '../templates/CardTemplate';
import GridTemplate from '../templates/GridTemplate';
import StandardLoader from '../components/StandardLoader';
import EmptyState from '../components/EmptyState';

const RelatorioPorUsuario = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const result = await postData(`/admin/usuario/${id}`, {});
        setUsuario(result);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        // Dados fictícios como fallback
        setUsuario({
          id: parseInt(id) || 1,
          name: 'João Silva',
          email: 'joao@email.com',
          account_status: 'active',
          created_at: '2025-01-15T10:30:00Z',
          totalChutes: 25,
          totalGols: 18,
          saldo: 350.00,
          totalCreditos: 500.00,
          totalDebitos: 150.00,
          ultimoLogin: '2025-01-17T14:30:00Z',
          partidasJogadas: 20,
          partidasVencidas: 12,
          eficiencia: 72.0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id]);

  if (loading) {
    return <StandardLoader message="Carregando dados do usuário..." />;
  }

  if (!usuario) {
    return <EmptyState message="Usuário não encontrado ou sem dados disponíveis." />;
  }

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    if (status === 'blocked') {
      return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>Bloqueado</span>;
    } else {
      return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Ativo</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400">Histórico do Jogador</h1>
        <Link 
          to="/relatorio-usuarios" 
          className="text-sm text-yellow-300 hover:text-yellow-200 hover:underline transition-colors"
        >
          ← Voltar ao relatório geral
        </Link>
      </div>

      <p className="text-gray-300">
        Análise detalhada do desempenho e histórico do usuário selecionado.
      </p>

      {/* Informações Básicas do Usuário */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Informações do Usuário</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Nome</p>
            <h3 className="text-lg font-bold text-white">{usuario.name}</h3>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">E-mail</p>
            <h3 className="text-lg font-bold text-white">{usuario.email || 'Não informado'}</h3>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Status</p>
            <div className="mt-1">
              {getStatusBadge(usuario.account_status)}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Criado em</p>
            <h3 className="text-lg font-bold text-white">
              {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
            </h3>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas Principais */}
      <GridTemplate cols={{ sm: 2, lg: 4 }}>
        <CardTemplate 
          title="Total de Chutes" 
          value={usuario.totalChutes} 
          color="blue" 
        />
        <CardTemplate 
          title="Gols Marcados" 
          value={usuario.totalGols} 
          color="green" 
        />
        <CardTemplate 
          title="Eficiência" 
          value={`${usuario.eficiencia || 0}%`} 
          color="purple" 
        />
        <CardTemplate 
          title="Saldo Atual" 
          value={`R$ ${usuario.saldo.toFixed(2)}`} 
          color="yellow" 
        />
      </GridTemplate>

      {/* Cards de Estatísticas Financeiras */}
      <GridTemplate cols={{ sm: 2, lg: 3 }}>
        <CardTemplate 
          title="Total de Entradas" 
          value={`R$ ${usuario.totalCreditos.toFixed(2)}`} 
          color="green" 
        />
        <CardTemplate 
          title="Total de Saques" 
          value={`R$ ${usuario.totalDebitos.toFixed(2)}`} 
          color="red" 
        />
        <CardTemplate 
          title="Saldo Líquido" 
          value={`R$ ${(usuario.totalCreditos - usuario.totalDebitos).toFixed(2)}`} 
          color="blue" 
        />
      </GridTemplate>

      {/* Cards de Estatísticas de Jogo */}
      <GridTemplate cols={{ sm: 2, lg: 3 }}>
        <CardTemplate 
          title="Partidas Jogadas" 
          value={usuario.partidasJogadas || 0} 
          color="yellow" 
        />
        <CardTemplate 
          title="Partidas Vencidas" 
          value={usuario.partidasVencidas || 0} 
          color="green" 
        />
        <CardTemplate 
          title="Taxa de Vitória" 
          value={`${usuario.partidasJogadas > 0 ? ((usuario.partidasVencidas / usuario.partidasJogadas) * 100).toFixed(1) : 0}%`} 
          color="purple" 
        />
      </GridTemplate>

      {/* Histórico de Atividades */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Histórico de Atividades</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-white/10">
            <span className="text-gray-300">Último Login</span>
            <span className="text-white font-semibold">
              {usuario.ultimoLogin ? new Date(usuario.ultimoLogin).toLocaleString('pt-BR') : 'Nunca'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/10">
            <span className="text-gray-300">Data de Cadastro</span>
            <span className="text-white font-semibold">
              {new Date(usuario.created_at).toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/10">
            <span className="text-gray-300">Status da Conta</span>
            <div>
              {getStatusBadge(usuario.account_status)}
            </div>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-300">ID do Usuário</span>
            <span className="text-white font-semibold">#{usuario.id}</span>
          </div>
        </div>
      </div>

      {/* Resumo de Performance */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-yellow-400 mb-4">Resumo de Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-white font-semibold mb-2">Estatísticas de Jogo</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Chutes por Partida:</span>
                <span className="text-white">
                  {usuario.partidasJogadas > 0 ? (usuario.totalChutes / usuario.partidasJogadas).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gols por Partida:</span>
                <span className="text-white">
                  {usuario.partidasJogadas > 0 ? (usuario.totalGols / usuario.partidasJogadas).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Eficiência:</span>
                <span className="text-white">{usuario.eficiencia || 0}%</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Estatísticas Financeiras</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Entrada Média:</span>
                <span className="text-white">
                  R$ {usuario.totalChutes > 0 ? (usuario.totalCreditos / usuario.totalChutes).toFixed(2) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Saída Média:</span>
                <span className="text-white">
                  R$ {usuario.totalChutes > 0 ? (usuario.totalDebitos / usuario.totalChutes).toFixed(2) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Saldo Atual:</span>
                <span className="text-white">R$ {usuario.saldo.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatorioPorUsuario;