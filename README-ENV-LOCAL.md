# Configuração Local - Admin Gol de Ouro

## Variáveis de Ambiente

### Obrigatórias
- `VITE_API_URL`: URL da API Backend (padrão: http://localhost:3000)

### Opcionais
- `VITE_ADMIN_TOKEN`: Token para rotas protegidas

## Configuração Local

1. **Crie o arquivo** `.env.local` na pasta `goldeouro-admin`
2. **Configure** a variável obrigatória:

```bash
# URL da API Backend
VITE_API_URL=http://localhost:3000
```

3. **Execute** o admin: `npm run dev`

## Configuração no Vercel

Para produção, configure no Vercel:

```bash
# Production
vercel env add VITE_API_URL production
# Valor: https://seu-backend.onrender.com

# Preview  
vercel env add VITE_API_URL preview
# Valor: https://seu-backend.onrender.com
```

## URLs de Desenvolvimento

- **Admin**: http://localhost:5173 (ou 5174 se 5173 estiver ocupada)
- **Backend**: http://localhost:3000

## Estrutura do Projeto

- **Router único**: `src/AppRoutes.jsx`
- **ErrorBoundary global**: `src/shared/ErrorBoundary.jsx`
- **Client de API**: `src/js/api.js` + `src/services/api.js`
- **Configuração**: `src/config/env.js`

## Funcionalidades

- ✅ Anti-tela branca com ErrorBoundary + Suspense
- ✅ Router unificado com lazy loading seguro
- ✅ Client de API padronizado
- ✅ Fallback para localhost:3000
- ✅ Guardrails para desenvolvimento

## Troubleshooting

Se o admin não abrir:
1. Verifique se o backend está rodando em :3000
2. Confirme se `.env.local` tem `VITE_API_URL` correto
3. Execute `npm run dev` novamente
4. Verifique a porta (5173 ou 5174)
