# Gol de Ouro Admin

Painel administrativo React/Vite para o jogo Gol de Ouro.

## 🚀 Configuração Local

### Pré-requisitos
- Node.js 18+
- npm 8+
- Backend rodando em http://localhost:3000

### Instalação
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas configurações

# Rodar em desenvolvimento
npm run dev
```

### Variáveis de Ambiente (.env.local)
```bash
# URL da API Backend
VITE_API_URL=http://localhost:3000

# Token admin (opcional para desenvolvimento)
VITE_ADMIN_TOKEN=seu_token_aqui
```

## 🌐 Configuração Produção (Vercel)

### Variáveis de Ambiente no Vercel
```bash
VITE_API_URL=https://seu-backend.onrender.com
VITE_ADMIN_TOKEN=seu_token_admin_producao
```

### Deploy
```bash
# Deploy preview
npm run deploy:preview

# Deploy produção
npm run deploy:prod
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── layouts/            # Layouts das páginas
├── pages/              # Páginas da aplicação
├── shared/             # Componentes compartilhados (ErrorBoundary)
├── js/                 # Utilitários JavaScript
├── services/           # Serviços de API
├── AppRoutes.jsx       # Roteamento principal
├── App.jsx            # Componente raiz
└── main.jsx           # Entry point
```

## 🛡️ Recursos de Segurança

- **ErrorBoundary**: Captura erros de renderização
- **Suspense**: Loading states para lazy loading
- **safeLazy**: Importação segura de componentes
- **ProtectedRoute**: Autenticação de rotas
- **CORS**: Configurado para localhost e produção

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento local
npm run build        # Build para produção
npm run preview      # Preview do build
npm run deploy       # Deploy via script PowerShell
npm run deploy:prod  # Deploy produção Vercel
npm run verify       # Verificar build
```

## 🚨 Troubleshooting

### Erro "Failed to fetch"
1. Verifique se o backend está rodando
2. Confirme VITE_API_URL em .env.local
3. Verifique CORS no backend

### Tela em branco
1. Abra DevTools e verifique erros no console
2. ErrorBoundary deve capturar erros de renderização
3. Verifique se todas as páginas estão sendo importadas corretamente

### Porta ocupada
O Vite tentará automaticamente as portas 5173, 5174, etc.

## 📱 URLs de Desenvolvimento

- **Admin**: http://localhost:5173 (ou 5174)
- **Backend**: http://localhost:3000
- **Health**: http://localhost:3000/health
- **Dashboard**: http://localhost:3000/api/public/dashboard

## 🔗 Links Úteis

- [Vite Documentation](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
