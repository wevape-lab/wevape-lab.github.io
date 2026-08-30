/* WEVAPE 운서역점 — 네트워크 우선, 실패 시 캐시.
   사이트를 업데이트하면 다음 접속에서 바로 최신본이 나옵니다. */
var V = 'wv-unseo-v1';

self.addEventListener('install', function(e){ self.skipWaiting(); });

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys()
      .then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== V; })
                                               .map(function(k){ return caches.delete(k); })); })
      .then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET') return;
  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;

  e.respondWith((async function(){
    var cache = await caches.open(V);
    try {
      var net = await fetch(req);
      if (net && net.ok && net.type === 'basic') { cache.put(req, net.clone()); }
      return net;
    } catch (err) {
      var hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      throw err;
    }
  })());
});
