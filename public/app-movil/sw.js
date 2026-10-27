const CACHE='cndp-2026-web-v1';
const LOCAL=['./','./index.html','./style.css','./data.js','./app.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(c=>c.addAll(LOCAL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL('./',self.registration.scope).pathname))return;
 event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{
 if(response.ok){const clone=response.clone();caches.open(CACHE).then(c=>c.put(event.request,clone));}
 return response;
 }).catch(()=>event.request.mode==='navigate'?caches.match('./index.html'):Response.error())));
});
