import { useState } from "react";

export default function BleConnector() {
  const [status, setStatus] = useState("Desconectado");
  const [sensorData, setSensorData] = useState("");
  const [robotID, setRobotID] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [wifiSSID, setWifiSSID] = useState<string>("");
  const [wifiPass, setWifiPass] = useState<string>("");
  const [showWifiForm, setShowWifiForm] = useState(false);

  const [ssidChar, setSsidChar] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [passChar, setPassChar] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [wifiTriggerChar, setWifiTriggerChar] = useState<BluetoothRemoteGATTCharacteristic | null>(null);

  async function connectToBLE() {
    try {
      setErrorText(null);
      setStatus("Buscando dispositivo...");

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "SensorBot" }, { name: "Arduino" }],
        optionalServices: ["19b10000-e8f2-537e-4f6c-d104768a1214"]
      });

      setStatus("Conectando...");
      const server = await device.gatt?.connect();

      const service = await server?.getPrimaryService("19b10000-e8f2-537e-4f6c-d104768a1214");
      if (!service) {
        setStatus("Servicio no encontrado ❌");
        return;
      }

      const idC = await service.getCharacteristic("19b10001-e8f2-537e-4f6c-d104768a1214");
      const ssidC = await service.getCharacteristic("19b10002-e8f2-537e-4f6c-d104768a1214");
      const passC = await service.getCharacteristic("19b10003-e8f2-537e-4f6c-d104768a1214");
      const triggerC = await service.getCharacteristic("19b10004-e8f2-537e-4f6c-d104768a1214"); // NUEVA

      setSsidChar(ssidC);
      setPassChar(passC);
      setWifiTriggerChar(triggerC);

      const idValue = await idC.readValue();
      if (idValue) {
        const decoder = new TextDecoder("utf-8");
        const idText = decoder.decode(idValue);
        setRobotID(idText);
        setStatus(`Conectado a ${idText}`);
      }
    } catch (err: any) {
      setErrorText(`Error: ${err.message || err}`);
      setStatus("Error al conectar ❌");
    }
  }

  const sendWifi = async () => {
    if (!ssidChar || !passChar || !wifiTriggerChar) {
      setErrorText("No hay conexión BLE activa");
      return;
    }
    try {
      const encoder = new TextEncoder();
      await ssidChar.writeValue(encoder.encode(wifiSSID));
      await passChar.writeValue(encoder.encode(wifiPass));

      // Trigger para que Arduino conecte a WiFi
      await wifiTriggerChar.writeValue(new Uint8Array([1]));

      setStatus(`Credenciales enviadas a ${robotID}`);
      setShowWifiForm(false);
    } catch (err: any) {
      setErrorText(`Error enviando credenciales: ${err.message || err}`);
    }
  };

  return (
    <div className="p-4 text-center flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold mb-2">Estado: {status}</h2>

      {!robotID && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={connectToBLE}
        >
          Conectar a SensorBot
        </button>
      )}

      {robotID && (
        <>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => setShowWifiForm(!showWifiForm)}
          >
            Conectar a red
          </button>

          {showWifiForm && (
            <div className="flex flex-col gap-2 mt-2">
              <input
                className="border p-2 rounded"
                placeholder="SSID"
                value={wifiSSID}
                onChange={(e) => setWifiSSID(e.target.value)}
              />
              <input
                className="border p-2 rounded"
                type="password"
                placeholder="Password"
                value={wifiPass}
                onChange={(e) => setWifiPass(e.target.value)}
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={sendWifi}
              >
                Enviar credenciales
              </button>
            </div>
          )}
        </>
      )}

      {errorText && (
        <p className="mt-4 text-red-600 text-sm">⚠ {errorText}</p>
      )}
    </div>
  );
}
