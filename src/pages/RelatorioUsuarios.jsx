// src/pages/RelatorioUsuarios.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

const RelatorioUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.post('/admin/relatorio-usuarios', {});
        setUsuarios(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleExport = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const url = API_URL + '/admin/exportar/usuarios-csv';
    window.open(url, "_blank");
  };

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="bg-card text-foreground p-8 rounded shadow-md max-w-7xl mx-auto mt-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-yellow-400">Relatório de Usuários</h1>
          <button
            onClick={handleExport}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded"
          >
            Exportar CSV
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : usuarios.length === 0 ? (
          <p className="text-center text-muted-foreground mt-10">Ainda não possui dados...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-border rounded-lg shadow-sm">
              <thead className="bg-[#111827] text-yellow-300 uppercase text-sm">
                <tr>
                  <th className="px-4 py-3 border border-border">Nome</th>
                  <th className="px-4 py-3 border border-border">Chutes</th>
                  <th className="px-4 py-3 border border-border">Gols</th>
                  <th className="px-4 py-3 border border-border text-green-400">Entradas (R$)</th>
                  <th className="px-4 py-3 border border-border text-red-400">Saques (R$)</th>
                  <th className="px-4 py-3 border border-border">Saldo (R$)</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className="text-center hover:bg-muted/30 text-sm transition-colors"
                  >
                    <td className="px-4 py-2 border border-border font-medium">
                      <Link
                        to={`/relatorio-usuario/${usuario.id}`}
                        className="text-yellow-300 hover:underline"
                      >
                        {usuario.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2 border border-border">{usuario.totalChutes}</td>
                    <td className="px-4 py-2 border border-border">{usuario.totalGols}</td>
                    <td className="px-4 py-2 border border-border text-green-400 font-semibold">
                      R$ {usuario.totalCreditos}
                    </td>
                    <td className="px-4 py-2 border border-border text-red-400 font-semibold">
                      R$ {usuario.totalDebitos}
                    </td>
                    <td className="px-4 py-2 border border-border font-bold">
                      R$ {usuario.saldo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatorioUsuarios;
