// src/pages/RelatorioPorUsuario.jsx

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

const RelatorioPorUsuario = () => {
  const { id } = useParams(); // ID do usuário da URL
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await api.get(`/admin/usuario/${id}`);
        setUsuario(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id]);

  if (loading) return <Loader />;

  if (!usuario) {
    return (
      <div className="bg-background text-foreground min-h-screen p-8">
        <div className="bg-card p-6 rounded shadow-md max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground mt-10">Usuário não encontrado ou sem dados disponíveis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen p-8">
      <div className="bg-card p-6 rounded shadow-md max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-yellow-400">Histórico do Jogador</h1>
          <Link to="/relatorio-usuarios" className="text-sm text-yellow-300 hover:underline">
            ← Voltar ao relatório geral
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-sm text-muted-foreground">Nome</p>
            <h2 className="text-lg font-bold">{usuario.name}</h2>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">E-mail</p>
            <h2 className="text-lg font-bold">{usuario.email || 'Não informado'}</h2>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <span className={`inline-block px-2 py-1 text-xs font-bold rounded ${usuario.account_status === 'blocked' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
              {usuario.account_status === 'blocked' ? 'Bloqueado' : 'Ativo'}
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Criado em</p>
            <h2 className="text-lg font-bold">
              {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-[#111827] p-4 rounded-lg text-center shadow">
            <p className="text-sm text-gray-300">Total de Chutes</p>
            <h2 className="text-xl font-bold text-white">{usuario.totalChutes}</h2>
          </div>
          <div className="bg-[#111827] p-4 rounded-lg text-center shadow">
            <p className="text-sm text-gray-300">Gols Marcados</p>
            <h2 className="text-xl font-bold text-white">{usuario.totalGols}</h2>
          </div>
          <div className="bg-[#111827] p-4 rounded-lg text-center shadow">
            <p className="text-sm text-gray-300">Saldo Atual</p>
            <h2 className="text-xl font-bold text-green-400">R$ {usuario.saldo}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatorioPorUsuario;
