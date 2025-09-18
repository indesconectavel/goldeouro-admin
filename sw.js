const CACHE_NAME = 'goldeouro-admin-v4.0.0';
const STATIC_CACHE = 'static-v4.0.0';
const DYNAMIC_CACHE = 'dynamic-v4.0.0';

// Arquivos estáticos para cache
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker instalando...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Cacheando arquivos estáticos...');
        return Promise.allSettled(
          STATIC_FILES.map(url => 
            cache.add(url).catch(err => {
              console.warn(`⚠️ Não foi possível cachear ${url}:`, err);
              return null;
            })
          )
        );
      })
      .then(() => {
        console.log('✅ Service Worker instalado com sucesso');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Erro ao instalar Service Worker:', error);
        // Mesmo com erro, ativar o service worker
        return self.skipWaiting();
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker ativando...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker ativado com sucesso');
        return self.clients.claim();
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Estratégia de cache para diferentes tipos de recursos
  if (request.method === 'GET') {
    if (url.pathname.startsWith('/api/')) {
      // API calls - Network First
      event.respondWith(networkFirstStrategy(request));
    } else if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico)$/)) {
      // Assets estáticos - Cache First
      event.respondWith(cacheFirstStrategy(request));
    } else {
      // Páginas HTML - Stale While Revalidate
      event.respondWith(staleWhileRevalidateStrategy(request));
    }
  }
});

// Estratégia: Network First (para APIs)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 Rede indisponível, buscando no cache...');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Retornar resposta offline para APIs
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'Você está offline. Algumas funcionalidades podem estar limitadas.',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Estratégia: Cache First (para assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Erro ao buscar asset:', error);
    return new Response('Asset não encontrado', { status: 404 });
  }
}

// Estratégia: Stale While Revalidate (para páginas)
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Se falhar, retornar cache se disponível
    return cachedResponse;
  });
  
  return cachedResponse || fetchPromise;
}

// Notificações push
self.addEventListener('push', (event) => {
  console.log('📱 Push notification recebida');
  
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do Gol de Ouro',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalhes',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Gol de Ouro Admin', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notificação clicada');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Implementar sincronização de dados offline
    console.log('🔄 Executando sincronização em background...');
    
    // Aqui você pode implementar a lógica de sincronização
    // Por exemplo, enviar dados que foram salvos offline
    
  } catch (error) {
    console.error('❌ Erro na sincronização:', error);
  }
}

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('🎯 Service Worker carregado - Gol de Ouro Admin v4.0.0');
