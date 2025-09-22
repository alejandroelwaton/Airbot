import { useEffect, useState } from "react";

const BACKEND_URL = "https://6feb745b8087.ngrok-free.app";
const VAPID_PUBLIC_KEY =
  "BNZfSnVZA12cOzoITwbiCnCYLCu662ZkaKljCljDgb5-d4ByXxt9isZwmpPJsQNGALYvaEVXoGB3gA9aZ0nwLRI";

      const ask = async()=>{
        // Solo pedir permiso si no se hizo antes
        if (Notification.permission !== "granted") {
          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            console.log("Permiso de notificaciones denegado");
            return;
          }
        }
    }
export default function NotificationService() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    const initPush = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registrado", registration);


        // Chequear si ya hay suscripción guardada
        let sub = localStorage.getItem("pushSubscription");
        if (sub) {
          setSubscription(JSON.parse(sub));
          console.log("Suscripción cargada desde localStorage");
          return;
        }

        const newSub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        setSubscription(newSub);
        localStorage.setItem("pushSubscription", JSON.stringify(newSub));

        // Enviar al backend solo si no existe
        const res = await fetch(`${BACKEND_URL}/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSub),
        });
        console.log("Suscripción enviada al backend:", await res.json());
      } catch (err) {
        console.error("Error inicializando push:", err);
      }
    };

    initPush();
  }, []);

  const sendNotification = async () => {
    if (!subscription) return alert("No hay suscripción disponible");
    try {
      const res = await fetch(`${BACKEND_URL}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Alerta importante!", subscription }),
      });
      console.log("Notificación enviada:", await res.json());
    } catch (err) {
      console.error("Error enviando notificación:", err);
    }
  };

  return (
    <>
    <button onClick={sendNotification} style={{ padding: "8px 16px" }}>
      Enviar Notificación
    </button>
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 999, color: "#fff", background: "#FF0"}}>
      <button onClick={ask}>
        Activar notificaciones
      </button>
    </div></>
  );
}

// Helper para convertir VAPID Key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
}
