import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExportarDados from '../pages/ExportarDados';

// Mock do securityLogger
jest.mock('../utils/securityLogger', () => ({
  logSecurityError: jest.fn(),
}));

describe('ExportarDados', () => {
  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
  });

  test('renderiza o título e descrição corretamente', () => {
    render(<ExportarDados />);
    
    expect(screen.getByText('📤 Exportação de Dados')).toBeInTheDocument();
    expect(screen.getByText(/Faça o download de relatórios completos/)).toBeInTheDocument();
  });

  test('renderiza todos os cards de exportação', () => {
    render(<ExportarDados />);
    
    expect(screen.getByText('👥')).toBeInTheDocument();
    expect(screen.getByText('Usuários')).toBeInTheDocument();
    expect(screen.getByText('⚽')).toBeInTheDocument();
    expect(screen.getByText('Chutes')).toBeInTheDocument();
    expect(screen.getByText('💳')).toBeInTheDocument();
    expect(screen.getByText('Transações')).toBeInTheDocument();
    expect(screen.getByText('💰')).toBeInTheDocument();
    expect(screen.getByText('Saques')).toBeInTheDocument();
    expect(screen.getByText('📊')).toBeInTheDocument();
    expect(screen.getByText('Relatório Geral')).toBeInTheDocument();
  });

  test('botões de exportação estão presentes', () => {
    render(<ExportarDados />);
    
    const exportButtons = screen.getAllByText(/Exportar CSV/);
    expect(exportButtons).toHaveLength(5);
  });

  test('exibe estatísticas dos dados', () => {
    render(<ExportarDados />);
    
    expect(screen.getByText('5')).toBeInTheDocument(); // Usuários cadastrados
    expect(screen.getByText('5')).toBeInTheDocument(); // Chutes realizados
    expect(screen.getByText('5')).toBeInTheDocument(); // Transações
    expect(screen.getByText('5')).toBeInTheDocument(); // Solicitações de saque
  });

  test('funciona o download de CSV quando clicado', async () => {
    render(<ExportarDados />);
    
    const usuarioButton = screen.getByText('📥 Exportar CSV');
    fireEvent.click(usuarioButton);
    
    await waitFor(() => {
      expect(screen.getByText(/usuarios.csv exportado com sucesso!/)).toBeInTheDocument();
    });
  });

  test('exibe loading durante exportação', async () => {
    render(<ExportarDados />);
    
    const usuarioButton = screen.getByText('📥 Exportar CSV');
    fireEvent.click(usuarioButton);
    
    expect(screen.getByText('⏳ Exportando...')).toBeInTheDocument();
  });

  test('exibe informações técnicas', () => {
    render(<ExportarDados />);
    
    expect(screen.getByText('ℹ️ Informações Técnicas')).toBeInTheDocument();
    expect(screen.getByText('Formato dos Arquivos')).toBeInTheDocument();
    expect(screen.getByText('Compatibilidade')).toBeInTheDocument();
  });
});
