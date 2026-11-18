const CACHE='hahadu-v20261118110200';
const CORE=['./','./index.html','./manifest.webmanifest','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  // 页面导航强制绕过 GitHub Pages 的 max-age=600 强缓存，保证每次都拿到最新版
  const opt=e.request.mode==='navigate'?{cache:'no-store'}:undefined;
  e.respondWith(
    fetch(e.request,opt).then(res=>{
      const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));
      return res;
    }).catch(()=>caches.match(e.request).then(m=>m||caches.match('./index.html')))
  );
});
