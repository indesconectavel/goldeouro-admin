// csp-production.js - Content Security Policy para produção
// Este arquivo contém uma CSP pragmática que pode ser usada em produção

export const CSP_PRODUCTION = {
  // CSP básico para produção - ajuste conforme necessário
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Necessário para React
    "'unsafe-eval'",   // Necessário para React DevTools em produção
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Necessário para Tailwind CSS
  ],
  'img-src': [
    "'self'",
    "data:",
    "https:",
  ],
  'font-src': [
    "'self'",
    "data:",
  ],
  'connect-src': [
    "'self'",
    // Adicione aqui os domínios da sua API
    "https://api.goldeouro.com",
    "https://localhost:3000", // Para desenvolvimento local
  ],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

// Função para gerar string CSP
export function generateCSPString(csp = CSP_PRODUCTION) {
  return Object.entries(csp)
    .map(([key, values]) => {
      if (values.length === 0) {
        return key;
      }
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
}

// Exemplo de uso:
// const cspString = generateCSPString();
// console.log(cspString);

// Para usar em produção, adicione no seu servidor:
// res.setHeader('Content-Security-Policy', cspString);

// OU no HTML (não recomendado para produção):
// <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline';">
