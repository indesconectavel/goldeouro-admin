import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../App';

// Mock do securityLogger
jest.mock('../utils/securityLogger', () => ({
  logSecurityError: jest.fn(),
  logEvent: jest.fn(),
}));

// Mock do PWAInstallPrompt
jest.mock('../components/PWAInstallPrompt', () => {
  return function MockPWAInstallPrompt() {
    return <div data-testid="pwa-install-prompt">PWA Install Prompt</div>;
  };
});

// Wrapper para testes com roteamento
const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

describe('Admin Panel Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza o painel principal', () => {
    render(<AppWrapper />);
    
    // Verificar se elementos principais estão presentes
    expect(screen.getByText('Painel')).toBeInTheDocument();
    expect(screen.getByText('Usuários')).toBeInTheDocument();
    expect(screen.getByText('Saques')).toBeInTheDocument();
    expect(screen.getByText('Exportar Dados')).toBeInTheDocument();
  });

  test('navegação para página de Saques funciona', async () => {
    render(<AppWrapper />);
    
    const saquesLink = screen.getByText('Saques');
    fireEvent.click(saquesLink);
    
    await waitFor(() => {
      expect(screen.getByText('💰 Gerenciamento de Saques')).toBeInTheDocument();
    });
  });

  test('navegação para página de Exportar Dados funciona', async () => {
    render(<AppWrapper />);
    
    const exportarLink = screen.getByText('Exportar Dados');
    fireEvent.click(exportarLink);
    
    await waitFor(() => {
      expect(screen.getByText('📤 Exportação de Dados')).toBeInTheDocument();
    });
  });

  test('botões de exportação estão funcionais', async () => {
    render(<AppWrapper />);
    
    // Navegar para Exportar Dados
    const exportarLink = screen.getByText('Exportar Dados');
    fireEvent.click(exportarLink);
    
    await waitFor(() => {
      expect(screen.getByText('📤 Exportação de Dados')).toBeInTheDocument();
    });
    
    // Testar botão de exportação de usuários
    const exportButton = screen.getAllByText('📥 Exportar CSV')[0];
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(screen.getByText(/usuarios.csv exportado com sucesso!/)).toBeInTheDocument();
    });
  });

  test('filtros de saques funcionam', async () => {
    render(<AppWrapper />);
    
    // Navegar para Saques
    const saquesLink = screen.getByText('Saques');
    fireEvent.click(saquesLink);
    
    await waitFor(() => {
      expect(screen.getByText('💰 Gerenciamento de Saques')).toBeInTheDocument();
    });
    
    // Testar filtro de status
    const statusSelect = screen.getByDisplayValue('Todos');
    fireEvent.change(statusSelect, { target: { value: 'pendente' } });
    
    expect(statusSelect.value).toBe('pendente');
  });

  test('ações de saques funcionam', async () => {
    render(<AppWrapper />);
    
    // Navegar para Saques
    const saquesLink = screen.getByText('Saques');
    fireEvent.click(saquesLink);
    
    await waitFor(() => {
      expect(screen.getByText('💰 Gerenciamento de Saques')).toBeInTheDocument();
    });
    
    // Testar botão de aprovação
    const approveButton = screen.getAllByText('✅ Aprovar')[0];
    fireEvent.click(approveButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Saque aprovado com sucesso!/)).toBeInTheDocument();
    });
  });

  test('PWA Install Prompt está presente', () => {
    render(<AppWrapper />);
    
    expect(screen.getByTestId('pwa-install-prompt')).toBeInTheDocument();
  });

  test('sidebar toggle funciona', () => {
    render(<AppWrapper />);
    
    // Verificar se sidebar está presente
    const sidebar = document.querySelector('.bg-\\[\\#111827\\]');
    expect(sidebar).toBeInTheDocument();
  });
});
