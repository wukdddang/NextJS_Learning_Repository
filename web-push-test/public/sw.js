self.addEventListener("push", function (event) {
  let payload = {};
  try {
    payload = event.data.json();
  } catch (e) {
    payload = {
      title: "푸시 알림",
      body: event.data.text(),
    };
  }

  const options = {
    body: payload.body,
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [200, 100, 200],
    data: payload.url || "/",
    actions: payload.actions || [],
    tag: "push-notification",
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || "푸시 알림", options)
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});

// 서비스 워커 설치 이벤트
self.addEventListener("install", function (event) {
  event.waitUntil(self.skipWaiting());
});

// 서비스 워커 활성화 이벤트
self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});
