// src/context/SensorContext.tsx
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";


interface SensorData {
  temp: number;
  hum: number;
  co2: number;
}

export const SensorContext = createContext<SensorData | null>(null);

export function SensorProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SensorData | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.0.8:8000/ws");

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        console.log("WS Data:", parsed);
        setData(parsed);
      } catch (err) {
        console.error("Error parsing WS data", err);
      }
    };

    return () => socket.close();
  }, []);

  return (
    <SensorContext.Provider value={data}>
      {children}
    </SensorContext.Provider>
  );
}
