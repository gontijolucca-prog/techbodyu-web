const CACHE = 'tbu-v3';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put('/index.html', c)); } return res })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }
  e.respondWith(
    fetch(req)
      .then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return res })
      .catch(() => caches.match(req))
  );
});
