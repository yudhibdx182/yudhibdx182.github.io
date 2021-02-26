let ver = 1;
self.addEventListener("install", (event) => {
    console.log('berhasil', event);
    //ketika sukses install sw.js
    event.waitUntil(
        //buka library caches, dan daftarkan file2 yang perlu di cache
        caches.open('aplikasiku' + ver).then((cache) => {
            console.log('mulai caching');
            return cache.addAll([
                '/index.html',
                '/serviceworker.html',
                '/responsive.html',
                '/promise.html',
                '/manipulasidom.html',
                '/sw.js',
                
                
                '/144.png',
                '/152.png',
                '/256.png',
                '/512.png',
            ]);
        }).then(() => {
            self.skipWaiting();
        }));
});

//tangani request client, ketika client aksess ke file cari dulu di cache
self.addEventListener("fetch", (event) => {
    console.log('fetching', event);
    event.respondWith(
        caches.match(event.request).then((resp) => { //pencocokan dengan cache
            if (resp) { //jika ada maka
                return resp; //ambil resp
            } else {
                return fetch(event.request); //ambil dari internet
            }
        }));
});
