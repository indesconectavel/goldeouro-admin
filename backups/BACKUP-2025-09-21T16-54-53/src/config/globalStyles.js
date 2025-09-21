// CONFIGURAÇÕES GLOBAIS DE ESTILO
// Garantir consistência em todas as páginas

export const GLOBAL_STYLES = {
  // Cores padronizadas
  colors: {
    primary: 'text-yellow-400',
    primaryBg: 'bg-yellow-400',
    secondary: 'text-gray-300',
    success: 'text-green-400',
    successBg: 'bg-green-500/20',
    error: 'text-red-400',
    errorBg: 'bg-red-500/20',
    warning: 'text-yellow-400',
    warningBg: 'bg-yellow-500/20',
    info: 'text-blue-400',
    infoBg: 'bg-blue-500/20',
    white: 'text-white',
    muted: 'text-gray-400'
  },

  // Classes de layout
  layout: {
    container: 'space-y-6',
    pageTitle: 'text-2xl font-bold text-yellow-400 mb-6',
    pageDescription: 'text-gray-300 mb-6',
    card: 'card p-6',
    cardSmall: 'card p-4',
    grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
    grid2: 'grid grid-cols-1 sm:grid-cols-2 gap-6',
    grid3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
  },

  // Classes de formulário
  form: {
    input: 'w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400',
    select: 'w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400',
    button: 'px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors',
    buttonSecondary: 'px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors'
  },

  // Classes de tabela
  table: {
    container: 'card p-6 border border-yellow-500/20',
    title: 'text-lg font-semibold text-yellow-400 mb-4',
    wrapper: 'overflow-x-auto',
    table: 'min-w-full',
    header: 'border-b border-yellow-500/20',
    headerCell: 'text-left py-2 text-yellow-300',
    row: 'border-b border-yellow-500/10',
    cell: 'py-2 text-white'
  },

  // Classes de badge
  badge: {
    base: 'px-2 py-1 rounded text-xs font-semibold',
    success: 'px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-400',
    error: 'px-2 py-1 rounded text-xs font-semibold bg-red-500/20 text-red-400',
    warning: 'px-2 py-1 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-400',
    info: 'px-2 py-1 rounded text-xs font-semibold bg-blue-500/20 text-blue-400',
    muted: 'px-2 py-1 rounded text-xs font-semibold bg-gray-500/20 text-gray-400'
  },

  // Estados de loading
  loading: {
    container: 'space-y-6',
    message: 'text-center text-yellow-400',
    spinner: 'animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4'
  },

  // Estados vazios
  empty: {
    container: 'space-y-6',
    message: 'text-center text-gray-400'
  }
};

// Funções utilitárias
export const getColorClass = (type, variant = 'default') => {
  return GLOBAL_STYLES.colors[`${type}${variant ? `_${variant}` : ''}`] || '';
};

export const getLayoutClass = (type) => {
  return GLOBAL_STYLES.layout[type] || '';
};

export const getFormClass = (type) => {
  return GLOBAL_STYLES.form[type] || '';
};

export const getTableClass = (type) => {
  return GLOBAL_STYLES.table[type] || '';
};

export const getBadgeClass = (type) => {
  return GLOBAL_STYLES.badge[type] || GLOBAL_STYLES.badge.base;
};

export default GLOBAL_STYLES;
