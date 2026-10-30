/* Congreso 2026: cache de respaldo, red prioritaria para evitar versiones obsoletas. */
const CACHE='cndp-2026-web-v6-cronograma-30oct';
const LOCAL=['./','./index.html','./style.css','./data.js','./ponencias.js','./ponencias-particulares.js','./app.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./logo-congreso.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(async cache=>{
   await Promise.allSettled(LOCAL.map(url=>cache.add(url)));
 }).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('cndp-2026-web-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL('./',self.registration.scope).pathname))return;
 event.respondWith((async()=>{
   try{
     const response=await fetch(event.request);
     if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{}));return response;}
     const saved=await caches.match(event.request);
     return saved||response;
   }catch(e){
     const saved=await caches.match(event.request);
     if(saved)return saved;
     if(event.request.mode==='navigate'){const fallback=await caches.match('./index.html');if(fallback)return fallback;}
     return Response.error();
   }
 })());
});
