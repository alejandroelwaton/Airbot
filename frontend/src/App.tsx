import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotificationService from "./components/NotificationService";
import About from "./components/About";
import Navbar from "./components/NavBar";
import Charts from "./components/Charts";
import BleConnector from "./components/ConnectRobot";
import Home from "./components/Home";
import { SensorProvider } from "./context/SensorContext";
import { useEffect } from "react";


interface NotificationPayload {
  title: string;
  body: string;
}

function SendNotificationButton() {
  const handleClick = async () => {
    const payload: NotificationPayload = {
      title: "Alerta importante",
      body: "El ambiente está contaminado",
    };

    try {
      const res = await fetch(`${"https://6feb745b8087.ngrok-free.app"}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Notificación enviada:", data);
    } catch (err) {
      console.error("Error enviando notificación:", err);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "10px 20px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Enviar notificación
    </button>
  );
}

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <Router>
      <SensorProvider>
        <Navbar />
        <main className="pt-24 p-8 bg-background min-h-screen text-foreground">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/connect" element={<BleConnector />} />
          </Routes>
        </main>
      </SensorProvider>
    </Router>
  );
}
