const CACHE='jiuwo-v202611161626';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=e.request.url;
  if(!u.startsWith(self.location.origin))return;
  e.respondWith(
    fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r})
      .catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
  );
});
