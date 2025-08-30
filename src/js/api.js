// src/js/api.js - Adaptador para src/services/api.js

import api from '../services/api';

// Funções de conveniência baseadas no cliente axios existente
export const getData = async (path) => {
  try {
    const response = await api.get(path);
    return response.data;
  } catch (error) {
    console.error(`[GET ${path}] Erro:`, error);
    throw new Error(`Falha ao buscar dados: ${error.message}`);
  }
};

export const postData = async (path, body = {}) => {
  try {
    const response = await api.post(path, body);
    return response.data;
  } catch (error) {
    console.error(`[POST ${path}] Erro:`, error);
    throw new Error(`Falha ao enviar dados: ${error.message}`);
  }
};

export const putData = async (path, body = {}) => {
  try {
    const response = await api.put(path, body);
    return response.data;
  } catch (error) {
    console.error(`[PUT ${path}] Erro:`, error);
    throw new Error(`Falha ao atualizar dados: ${error.message}`);
  }
};

export const del = async (path) => {
  try {
    const response = await api.delete(path);
    return response.data;
  } catch (error) {
    console.error(`[DELETE ${path}] Erro:`, error);
    throw new Error(`Falha ao deletar dados: ${error.message}`);
  }
};

// Exportar também o cliente api original
export { default as api } from '../services/api';
export * from '../services/api';
