import { useState } from "react";

export default function BleConnector() {
  const [status, setStatus] = useState("Desconectado");
  const [sensorData, setSensorData] = useState("");
  const [robotID, setRobotID] = useState<string | null>(null);

  async function connectToBLE() {
    try {
      setStatus("Buscando dispositivo...");

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "SensorBot" }],
        optionalServices: ["19b10000-e8f2-537e-4f6c-d104768a1214"]
      });

      setStatus("Conectando...");
      const server = await device.gatt?.connect();

      const service = await server?.getPrimaryService("19b10000-e8f2-537e-4f6c-d104768a1214");
      const characteristic = await service?.getCharacteristic("19b10001-e8f2-537e-4f6c-d104768a1214");

      const value = await characteristic?.readValue();
      if (value) {
        const decoder = new TextDecoder("utf-8");
        const idText = decoder.decode(value);
        setRobotID(idText);
        setStatus(`Conectado a SensorBot (${idText})`);
      } else {
        setStatus("Conectado a SensorBot (sin ID)");
      }

      // Opcional: escuchar notificaciones (si esperas datos dinámicos)
      await characteristic?.startNotifications();
      characteristic?.addEventListener("characteristicvaluechanged", (event: any) => {
        const val = event.target.value;
        const decoder = new TextDecoder("utf-8");
        const text = decoder.decode(val);
        setSensorData(text);
      });

    } catch (err) {
      console.error(err);
      setStatus("Error al conectar ❌");
    }
  }

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold mb-2">Estado: {status}</h2>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={connectToBLE}
      >
        Conectar a SensorBot
      </button>
      {sensorData && (
        <p className="mt-4 text-lg">
          📊 Datos del sensor: <strong>{sensorData}</strong>
        </p>
      )}
    </div>
  );
}
