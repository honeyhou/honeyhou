const CACHE='hahadu-v20261121111000';
/* 静态资源安装预缓存（都很小）；lib-lunar.js(426KB) 与 lucky-data.js 首次按需下载后进缓存 */
const CORE=['./','./index.html','./manifest.webmanifest','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  /* 每日动态/热梗：永不缓存，直接网络（URL带时间戳本来也不会命中缓存） */
  if(url.pathname.includes('news.json')||url.pathname.includes('memes.json'))return;
  /* 页面导航：网络优先（保证打开就是最新版），失败回退缓存 */
  if(e.request.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname==='/'||url.pathname.endsWith('/')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));return r}).catch(()=>caches.match('./index.html')));
    return;
  }
  /* 其余静态资源（lucky-data/lib-lunar/图标/清单）：缓存优先——打开秒取，不重复下载 */
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r})));
});
