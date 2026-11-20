const CACHE='jiuwo-v20261120021305';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=e.request.url;
  if(!u.startsWith(self.location.origin))return;
  // 页面导航强制绕过 GitHub Pages 的 max-age=600 强缓存，保证每次都拿到最新版
  const opt=e.request.mode==='navigate'?{cache:'no-store'}:undefined;
  e.respondWith(
    fetch(e.request,opt).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r})
      .catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
  );
});
