const URLs_TO_CACHE = [
    "/",
    "/db.js",
    "/index.js",
    "/manifest.json",
    "/style.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",

];

  const STATIC_CACHE = "my-site-cache-v1";
  const RUNTIME_CACHE = "data-cache-v1";
  
  self.addEventListener("install", event => {
    event.waitUntil(
      caches
        .open(STATIC_CACHE)
        .then(cache => cache.addAll(FILES_TO_CACHE))
        .then(() => self.skipWaiting())
    );
  });
  
  
  self.addEventListener("fetch", event => {
    // non GET requests are not cached and requests to other origins are not cached
    if (

      event.request.url.includes("/api/")
    ) {
        event.respondWith(
            caches.open(RUNTIME_CACHE).then(cache => {
              return fetch(event.request)
                .then(response => {
                    if(response.status===200){

                    
                  cache.put(event.request, response.clone());
                    }
                  return response;
                })
                .catch(() => caches.match(event.request));
            })
          );
    }

  
    // use cache first for all other requests for performance
    event.respondWith(
  
        // request is not in cache. make network request and cache the response
        
        fetch(event.request).catch(function(){
            return caches.match(event.request).then(function(res){
                if(res){
                    return res
                } else if(event.request.headers.get("accept").includes("text/html")){
                    return caches.match("/")
                }
            })
        })
    )
  })