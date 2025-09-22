navigator.serviceWorker.register("/sw.js", { scope: "/" });
self.addEventListener("push", function(event) {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/assets/output.png", // opcional
      })
    );
  }
);
