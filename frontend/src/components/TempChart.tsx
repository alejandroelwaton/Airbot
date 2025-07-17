import { useContext } from "react";
import { SensorContext } from "../context/SensorContext";
import SensorChart from "./SensorChart";

export default function TempChart() {
  const sensorData = useContext(SensorContext);

  if (!sensorData) return <p className="text-gray-500">Cargando temperatura...</p>;

  return (
    <SensorChart
      title="Temperatura"
      currentValue={sensorData.temp}
      unit="°C"
      color="#5ea500"
      maxPoints={40}
      minPoints={20}
    />
  );
}

