import { useContext } from "react";
import { SensorContext } from "../context/SensorContext";
import SensorChart from "./SensorChart";

export default function TempChart() {
  const sensorData = useContext(SensorContext);

  if (!sensorData) return <p className="text-gray-500">Cargando CO2...</p>;
  return (
    <SensorChart
      title="CO2 (dioxido de carbono)"
      currentValue={sensorData.co2}
      unit="ppm"
      color="#928873"
      maxPoints={100}
      minPoints={50}
    />
  );
}