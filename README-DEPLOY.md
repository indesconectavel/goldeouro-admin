# 🚀 Guia de Deploy - Gol de Ouro Admin v1.0.0

## 📋 Pré-requisitos

- Node.js 18+ 
- npm 8+
- Conta Vercel
- Backend rodando (Fly.io)

## 🛠️ Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Servidor de desenvolvimento
npm run build:dev    # Build para desenvolvimento
npm run preview      # Preview do build
```

### Produção
```bash
npm run build:prod   # Build otimizado para produção
npm run deploy:prod  # Deploy para produção (Vercel)
npm run preview:prod # Preview do build de produção
npm run analyze      # Análise do bundle
```

## 🚀 Deploy Rápido

### 1. Deploy Automático
```bash
# Deploy completo com script otimizado
node scripts/deploy-production.js
```

### 2. Deploy Manual
```bash
# Build de produção
npm run build:prod

# Deploy para Vercel
vercel --prod
```

## ⚙️ Configurações

### Variáveis de Ambiente
- `VITE_API_URL`: URL do backend (produção: https://goldeouro-backend.fly.dev)
- `VITE_ADMIN_TOKEN`: Token de autenticação admin
- `VITE_APP_NAME`: Nome da aplicação
- `VITE_APP_VERSION`: Versão da aplicação

### Otimizações Implementadas
- ✅ Code splitting por vendor
- ✅ Minificação com Terser
- ✅ Remoção de console.log em produção
- ✅ Compressão de assets
- ✅ Cache de dependências
- ✅ Lazy loading de componentes

## 📊 Performance

### Bundle Size
- Vendor: ~200KB (React, React-DOM)
- Router: ~50KB (React Router)
- UI: ~100KB (Framer Motion, Lucide)
- Utils: ~30KB (Axios)
- **Total: ~380KB** (otimizado)

### Carregamento
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3s

## 🔧 Troubleshooting

### Erro de Build
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build:prod
```

### Erro de Deploy
```bash
# Verificar configuração Vercel
vercel env ls
vercel logs
```

### Performance Issues
```bash
# Analisar bundle
npm run analyze
```

## 📱 Responsividade

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Componentes Responsivos
- ✅ Sidebar com drawer mobile
- ✅ Cards adaptativos
- ✅ Tabelas com scroll horizontal
- ✅ Botões touch-friendly

## 🎨 UX/UI Melhorias

### Componentes Adicionados
- ✅ LoadingSpinner com animações
- ✅ Toast notifications
- ✅ ConfirmDialog
- ✅ ErrorBoundary
- ✅ Hooks de performance

### Animações
- ✅ Framer Motion otimizado
- ✅ Transições suaves
- ✅ Loading states
- ✅ Hover effects

## 🔒 Segurança

### CSP Headers
- Content Security Policy configurado
- Fonts e scripts permitidos
- Imagens e assets seguros

### Autenticação
- Token admin configurado
- Rotas protegidas
- Validação de permissões

## 📈 Monitoramento

### Métricas
- Performance monitoring
- Error tracking
- User analytics
- API response times

### Logs
- Console logs removidos em produção
- Error boundaries ativos
- Toast notifications para feedback

## 🎯 Próximos Passos

1. **Configurar CI/CD** com GitHub Actions
2. **Implementar testes E2E** com Cypress
3. **Adicionar PWA** features
4. **Otimizar imagens** com WebP
5. **Implementar cache** com Service Worker

---

**Versão:** 1.0.0  
**Última atualização:** 2025-01-07  
**Status:** ✅ Pronto para produção


