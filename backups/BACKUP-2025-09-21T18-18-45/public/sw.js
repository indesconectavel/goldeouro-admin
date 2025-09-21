const CACHE_NAME = 'goldeouro-admin-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Função para verificar se a URL é válida para cache
function isValidUrlForCache(url) {
  // Não tentar cachear URLs de extensões do Chrome
  if (url.startsWith('chrome-extension://')) {
    return false;
  }
  // Não tentar cachear URLs de data:
  if (url.startsWith('data:')) {
    return false;
  }
  // Não tentar cachear URLs de blob:
  if (url.startsWith('blob:')) {
    return false;
  }
  return true;
}

// Instalar Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', function(event) {
  // Só processar requisições válidas
  if (!isValidUrlForCache(event.request.url)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Retornar do cache se disponível
        if (response) {
          return response;
        }
        // Senão, buscar da rede
        return fetch(event.request);
      })
  );
});