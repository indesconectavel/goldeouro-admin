import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Saques from '../pages/Saques';

// Mock do securityLogger
jest.mock('../utils/securityLogger', () => ({
  logSecurityError: jest.fn(),
}));

describe('Saques', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza o título e descrição corretamente', () => {
    render(<Saques />);
    
    expect(screen.getByText('💰 Gerenciamento de Saques')).toBeInTheDocument();
    expect(screen.getByText(/Gerencie solicitações de saque dos usuários/)).toBeInTheDocument();
  });

  test('renderiza filtros corretamente', () => {
    render(<Saques />);
    
    expect(screen.getByText('🔍 Filtros')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Data Início')).toBeInTheDocument();
    expect(screen.getByText('Data Fim')).toBeInTheDocument();
  });

  test('exibe estatísticas dos saques', () => {
    render(<Saques />);
    
    expect(screen.getByText('5')).toBeInTheDocument(); // Total de saques
    expect(screen.getByText('2')).toBeInTheDocument(); // Aprovados
    expect(screen.getByText('2')).toBeInTheDocument(); // Pendentes
    expect(screen.getByText('1')).toBeInTheDocument(); // Rejeitados
  });

  test('renderiza lista de saques', () => {
    render(<Saques />);
    
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('Pedro Costa')).toBeInTheDocument();
  });

  test('botões de ação estão presentes para saques pendentes', () => {
    render(<Saques />);
    
    const approveButtons = screen.getAllByText('✅ Aprovar');
    const rejectButtons = screen.getAllByText('❌ Rejeitar');
    
    expect(approveButtons.length).toBeGreaterThan(0);
    expect(rejectButtons.length).toBeGreaterThan(0);
  });

  test('funciona aprovação de saque', async () => {
    render(<Saques />);
    
    const approveButton = screen.getAllByText('✅ Aprovar')[0];
    fireEvent.click(approveButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Saque aprovado com sucesso!/)).toBeInTheDocument();
    });
  });

  test('funciona rejeição de saque', async () => {
    render(<Saques />);
    
    const rejectButton = screen.getAllByText('❌ Rejeitar')[0];
    fireEvent.click(rejectButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Saque rejeitado com sucesso!/)).toBeInTheDocument();
    });
  });

  test('exibe loading durante ações', async () => {
    render(<Saques />);
    
    const approveButton = screen.getAllByText('✅ Aprovar')[0];
    fireEvent.click(approveButton);
    
    expect(screen.getByText('Aprovando...')).toBeInTheDocument();
  });
});
