import React from "react";

const Configuracoes = () => {
  return (
    <div className="bg-background text-foreground min-h-screen p-8">
      <div className="bg-card p-6 rounded shadow-md max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">Configurações da Plataforma</h1>
        <p className="text-muted-foreground mb-6">
          Aqui você poderá ajustar parâmetros administrativos, regras de jogo, taxas da plataforma,
          limites de saque e notificações.
        </p>

        <div className="text-center text-sm text-gray-400 mt-20">
          Ainda não possui dados ou configurações disponíveis...
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
