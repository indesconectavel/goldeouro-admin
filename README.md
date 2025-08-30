# Gol de Ouro - Admin Panel

Painel administrativo React/Vite para o sistema Gol de Ouro, com autenticação, rotas protegidas e interface responsiva.

## 🚀 Como Rodar em Desenvolvimento

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

### Scripts Disponíveis
```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build para produção
npm run preview      # Preview do build local
npm run lint         # Verificar código (se configurado)
```

## 🔧 Variáveis de Ambiente

### Desenvolvimento (.env.local)
Crie um arquivo `.env.local` na raiz do projeto:

```bash
# API Backend
VITE_API_URL=http://localhost:3000

# Ambiente
VITE_NODE_ENV=development

# Outras variáveis específicas do projeto
VITE_APP_NAME=Gol de Ouro Admin
VITE_APP_VERSION=1.0.0
```

### Variáveis Obrigatórias
- `VITE_API_URL`: URL base da API backend
- `VITE_NODE_ENV`: Ambiente (development/production)

### Uso no Código
```javascript
// Acessar variáveis de ambiente
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const isDev = import.meta.env.DEV;
```

## 🏗️ Build e Preview

### Build para Produção
```bash
# Gerar build otimizado
npm run build

# O build será gerado na pasta dist/
```

### Preview Local
```bash
# Visualizar build localmente
npm run preview

# Disponível em http://localhost:4173
```

### Configuração do Build
O build está configurado no `vite.config.js` com:
- Otimizações para produção
- Code splitting automático
- Assets otimizados
- History API fallback para React Router

## 🚀 Deploy (Vercel)

### Configuração Automática
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Variáveis de Ambiente no Vercel
Configure no dashboard do Vercel:

```bash
# Produção
VITE_API_URL=https://api.goldeouro.com
VITE_NODE_ENV=production

# Staging (se aplicável)
VITE_API_URL=https://staging-api.goldeouro.com
VITE_NODE_ENV=staging
```

### Build Command
```bash
npm run build
```

### Output Directory
```bash
dist
```

### Deploy Manual
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 📁 Estrutura de Pastas

```
goldeouro-admin/
├── public/                 # Assets estáticos
│   ├── logo-gol.png       # Logo da aplicação
│   ├── favicon.png        # Favicon
│   └── index.html         # HTML base
├── src/
│   ├── assets/            # Assets do React
│   │   ├── logo.png       # Logo para componentes
│   │   └── react.svg      # SVG do React
│   ├── components/        # Componentes reutilizáveis
│   │   ├── Sidebar.jsx    # Menu lateral
│   │   ├── ProtectedRoute.jsx # Proteção de rotas
│   │   └── Loader.jsx     # Componente de loading
│   ├── layouts/           # Layouts da aplicação
│   │   └── MainLayout.jsx # Layout principal com Sidebar
│   ├── pages/             # Páginas/rotas da aplicação
│   │   ├── Dashboard.jsx  # Página inicial
│   │   ├── Login.jsx      # Página de login
│   │   ├── ListaUsuarios.jsx # Lista de usuários
│   │   └── ...            # Outras páginas
│   ├── services/          # Serviços externos
│   │   └── api.js         # Cliente HTTP (axios)
│   ├── js/                # Utilitários JavaScript
│   │   └── api.js         # Adaptador de API
│   ├── shared/            # Componentes compartilhados
│   │   └── ErrorBoundary.jsx # Tratamento de erros
│   ├── auth.js            # Sistema de autenticação
│   ├── App.jsx            # Componente principal
│   ├── AppRoutes.jsx      # Configuração de rotas
│   ├── main.jsx           # Ponto de entrada
│   └── index.css          # Estilos globais
├── .env.local             # Variáveis de ambiente (dev)
├── .gitignore             # Arquivos ignorados pelo Git
├── package.json           # Dependências e scripts
├── vite.config.js         # Configuração do Vite
└── README.md              # Este arquivo
```

## 🛣️ Convenções de Rotas

### Estrutura de Rotas
```
/                           → Redireciona para /painel
/login                      → Página de login (PÚBLICA)
/painel                     → Dashboard principal
/lista-usuarios             → Lista de usuários
/relatorio-usuarios         → Relatório de usuários
/relatorio-por-usuario      → Relatório individual
/relatorio-financeiro       → Relatório financeiro
/estatisticas               → Estatísticas gerais
/estatisticas-gerais        → Estatísticas detalhadas
/transacoes                 → Transações
/saque-usuarios             → Saques de usuários
/usuarios-bloqueados        → Usuários bloqueados
/fila                       → Fila de chutes
/top-jogadores              → Top jogadores
/backup                     → Backup do sistema
/configuracoes              → Configurações
/exportar-dados             → Exportação de dados
/logs                       → Logs do sistema
/chutes                     → Chutes recentes
```

### Proteção de Rotas
- **Públicas**: `/login`
- **Protegidas**: Todas as outras rotas
- **Autenticação**: Token no localStorage (`admin-token`)

### Lazy Loading
Todas as páginas usam lazy loading com fallback seguro:
```javascript
const Dashboard = safeLazy(() => import("./pages/Dashboard"), "Dashboard");
```

## 🔐 Sistema de Autenticação

### Funcionalidades
- Login com token
- Verificação de autenticação
- Proteção de rotas
- Logout funcional
- Loading states

### Implementação Atual
```javascript
// Verificação simples via localStorage
const token = localStorage.getItem('admin-token');
return !!token;
```

### TODO: Implementação Real
- Validação de token via API
- Refresh tokens
- Expiração automática
- Logout em múltiplas abas

## 🎨 Tecnologias Utilizadas

- **Frontend**: React 18 + Vite
- **Roteamento**: React Router DOM v6
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Deploy**: Vercel

## 🐛 Troubleshooting

### Problemas Comuns

#### Página em Branco
- Verificar se todas as rotas estão protegidas
- Confirmar se o ErrorBoundary está funcionando
- Verificar imports com case sensitivity

#### Erro de API
- Confirmar `VITE_API_URL` no .env.local
- Verificar se o backend está rodando
- Checar CORS no backend

#### Build Falha
- Limpar node_modules e reinstalar
- Verificar versão do Node.js
- Confirmar dependências no package.json

### Logs de Desenvolvimento
```bash
# Ver logs detalhados
npm run dev -- --debug

# Ver build logs
npm run build -- --debug
```

## 📝 Contribuição

### Padrões de Código
- Usar componentes funcionais com hooks
- Implementar lazy loading para novas páginas
- Seguir convenções de nomenclatura
- Adicionar tratamento de erro

### Estrutura de Commits
```
feat(admin): nova funcionalidade
fix(admin): correção de bug
docs(admin): documentação
refactor(admin): refatoração
```

## 📞 Suporte

Para dúvidas ou problemas:
- Verificar logs do console
- Consultar documentação das tecnologias
- Abrir issue no repositório

---

**Desenvolvido para Gol de Ouro** 🏆
