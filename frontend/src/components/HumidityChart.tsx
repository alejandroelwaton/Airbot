import { useContext } from "react";
import { SensorContext } from "../context/SensorContext";
import SensorChart from "./SensorChart";

export default function TempChart() {
  const sensorData = useContext(SensorContext);

  if (!sensorData) return <p className="text-gray-500">Cargando Humedad...</p>;

  return (
    <SensorChart
      title="Humedad"
      currentValue={sensorData.hum}
      unit="%"
      color="#758fbbff"
      maxPoints={100}
      minPoints={2}
    />
  );
}