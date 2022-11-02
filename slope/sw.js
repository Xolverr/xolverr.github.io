self.addEventListener('install', function(e) {
    e.waitUntil(
      caches.open('slope-cache').then(function(cache) {
        return cache.addAll([

          '/',
          '/index.html',
          '/README.md',
          '/sw.js',
          '/Build/slope.json',
          '/Build/slope_data.unityweb',
          '/Build/slope_framework.unityweb',
          '/Build/slope_memory.unityweb',
          '/Build/slope_wasmcode.unityweb',
          '/Build/slope_wasmframework.unityweb',
          '/TemplateData/progressEmpty.Dark.png',
          '/TemplateData/progressFull.Dark.png',
          '/TemplateData/progressLogo.Dark.png',
          '/TemplateData/style.css',
          '/TemplateData/unityloader41.js',
          '/TemplateData/UnityProgress.js'

        ]);
    })
  );
 });

console.log("service worker enabled :))))))))");
 
 
 self.addEventListener('fetch', function(event) {
     event.respondWith(
       caches.match(event.request).then(function(response) {
         return response || fetch(event.request);
       })
     );
    });