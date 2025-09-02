// src/js/api.js - Client de API padronizado

import api from '../services/api';
import { config } from '../config/env';

// Funções de conveniência baseadas no cliente axios existente
export const getData = async (path) => {
  try {
    const response = await api.get(path);
    return response.data;
  } catch (error) {
    console.error(`[GET ${path}] Erro:`, error);
    
    // Tratamento específico para diferentes tipos de erro
    if (error.code === 'ERR_NETWORK') {
      throw new Error(`Erro de conexão com ${config.API_URL}. Verifique se o backend está rodando.`);
    }
    
    if (error.response?.status === 404) {
      throw new Error('Endpoint não encontrado.');
    }
    
    if (error.response?.status === 500) {
      throw new Error('Erro interno do servidor.');
    }
    
    throw new Error(`Falha ao buscar dados: ${error.message}`);
  }
};

export const postData = async (path, body = {}) => {
  try {
    const response = await api.post(path, body);
    return response.data;
  } catch (error) {
    console.error(`[POST ${path}] Erro:`, error);
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error(`Erro de conexão com ${config.API_URL}. Verifique se o backend está rodando.`);
    }
    
    throw new Error(`Falha ao enviar dados: ${error.message}`);
  }
};

export const putData = async (path, body = {}) => {
  try {
    const response = await api.put(path, body);
    return response.data;
  } catch (error) {
    console.error(`[PUT ${path}] Erro:`, error);
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error(`Erro de conexão com ${config.API_URL}. Verifique se o backend está rodando.`);
    }
    
    throw new Error(`Falha ao atualizar dados: ${error.message}`);
  }
};

export const del = async (path) => {
  try {
    const response = await api.delete(path);
    // Tratar resposta 204 (sem conteúdo)
    return response.status === 204 ? null : response.data;
  } catch (error) {
    console.error(`[DELETE ${path}] Erro:`, error);
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error(`Erro de conexão com ${config.API_URL}. Verifique se o backend está rodando.`);
    }
    
    throw new Error(`Falha ao deletar dados: ${error.message}`);
  }
};

// Exportar também o cliente api original
export { default as api } from '../services/api';
export * from '../services/api';
