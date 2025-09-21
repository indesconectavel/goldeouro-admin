// Design System Unificado - Gol de Ouro Admin Panel
// Baseado na análise da página Dashboard funcionando perfeitamente

export const DESIGN_SYSTEM = {
  // Cores padronizadas
  colors: {
    primary: '#fbbf24',        // Amarelo principal
    primaryDark: '#f59e0b',    // Amarelo escuro
    background: '#000717',     // Azul escuro principal
    backgroundSecondary: '#111827', // Cinza escuro
    card: '#1f2937',           // Cinza escuro para cards
    cardHover: '#374151',      // Cinza médio para hover
    border: '#374151',         // Cinza médio para bordas
    borderHover: '#fbbf24',    // Amarelo para hover de bordas
    text: '#ffffff',           // Branco para texto principal
    textSecondary: '#9ca3af',  // Cinza claro para texto secundário
    textMuted: '#6b7280',      // Cinza para texto desabilitado
    success: '#10b981',        // Verde para sucesso
    warning: '#f59e0b',        // Amarelo para avisos
    error: '#ef4444',          // Vermelho para erros
    info: '#3b82f6',           // Azul para informações
  },

  // Espaçamentos padronizados
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    // Espaçamentos específicos
    section: 'space-y-8',      // 32px entre seções
    card: 'gap-4 md:gap-6',    // 16px/24px entre cards
    padding: 'p-4 md:p-6',     // 16px/24px padding
    paddingSmall: 'p-3',       // 12px padding pequeno
    paddingLarge: 'p-6 md:p-8', // 24px/32px padding grande
  },

  // Tipografia padronizada
  typography: {
    // Títulos
    title: {
      main: 'text-3xl font-bold text-yellow-400',           // Título principal
      section: 'text-xl md:text-2xl font-bold text-white mb-6', // Título de seção
      subsection: 'text-lg md:text-xl font-semibold text-white mb-4', // Subseção
      card: 'text-sm md:text-lg font-semibold text-yellow-400 mb-2', // Título de card
    },
    // Texto
    text: {
      primary: 'text-white',                    // Texto principal
      secondary: 'text-gray-400 text-lg',       // Texto secundário
      muted: 'text-gray-500',                   // Texto desabilitado
      small: 'text-sm text-gray-300',           // Texto pequeno
      large: 'text-lg',                         // Texto grande
    },
    // Valores e números
    value: {
      large: 'text-2xl md:text-3xl font-bold text-white',    // Valores grandes
      medium: 'text-xl font-bold text-white',                 // Valores médios
      small: 'text-lg font-semibold text-white',              // Valores pequenos
    },
    // Labels
    label: {
      primary: 'text-sm md:text-lg font-semibold text-yellow-400 mb-2',
      secondary: 'text-xs font-medium text-gray-300 uppercase tracking-wider',
    }
  },

  // Breakpoints responsivos
  breakpoints: {
    mobile: '0px - 639px',
    tablet: '640px - 1023px',
    desktop: '1024px+',
    // Breakpoints específicos
    smallMobile: '0px - 374px',
    largeMobile: '375px - 639px',
    smallTablet: '640px - 767px',
    largeTablet: '768px - 1023px',
  },

  // Configurações de cards por dispositivo
  cardConfig: {
    mobile: {
      grid: 'grid-cols-1 gap-3',
      padding: 'p-3',
      titleSize: 'text-sm',
      valueSize: 'text-xl',
      spacing: 'space-y-3'
    },
    tablet: {
      grid: 'grid-cols-2 gap-4',
      padding: 'p-4',
      titleSize: 'text-base',
      valueSize: 'text-2xl',
      spacing: 'space-y-4'
    },
    desktop: {
      grid: 'grid-cols-4 gap-6',
      padding: 'p-6',
      titleSize: 'text-lg',
      valueSize: 'text-3xl',
      spacing: 'space-y-6'
    }
  },

  // Configurações de layout
  layout: {
    container: 'w-full max-w-4xl mx-auto',
    section: 'space-y-8',
    header: 'mb-8',
    card: 'card', // Classe CSS global
    cardHover: 'hover:border-yellow-400 transition-colors duration-200',
  },

  // Animações e transições
  animations: {
    transition: 'transition-all duration-200 ease-in-out',
    hover: 'hover:scale-105 transition-transform duration-200',
    fade: 'transition-opacity duration-300',
    slide: 'transition-transform duration-300 ease-in-out',
  },

  // Estados de loading
  loading: {
    spinner: 'animate-spin',
    skeleton: 'animate-pulse',
    shimmer: 'bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse',
  },

  // Estados de status
  status: {
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    pending: 'bg-gray-500 text-white',
  }
};

// Função para obter configuração de card baseada no dispositivo
export const getCardConfig = (device) => {
  return DESIGN_SYSTEM.cardConfig[device] || DESIGN_SYSTEM.cardConfig.desktop;
};

// Função para obter classes de tipografia
export const getTypography = (type, variant = 'default') => {
  const typography = DESIGN_SYSTEM.typography[type];
  if (typeof typography === 'object') {
    return typography[variant] || typography.default || '';
  }
  return typography || '';
};

// Função para obter classes de cores
export const getColor = (type, variant = 'default') => {
  const color = DESIGN_SYSTEM.colors[type];
  if (typeof color === 'object') {
    return color[variant] || color.default || '';
  }
  return color || '';
};

// Função para obter classes de espaçamento
export const getSpacing = (type) => {
  return DESIGN_SYSTEM.spacing[type] || '';
};

// Constantes para uso em componentes
export const COLORS = DESIGN_SYSTEM.colors;
export const SPACING = DESIGN_SYSTEM.spacing;
export const TYPOGRAPHY = DESIGN_SYSTEM.typography;
export const BREAKPOINTS = DESIGN_SYSTEM.breakpoints;
export const LAYOUT = DESIGN_SYSTEM.layout;
export const ANIMATIONS = DESIGN_SYSTEM.animations;
export const LOADING = DESIGN_SYSTEM.loading;
export const STATUS = DESIGN_SYSTEM.status;

export default DESIGN_SYSTEM;
