import { useContext } from "react";
import { SensorContext } from "../context/SensorContext";
import SensorChart from "./SensorChart";

export default function TempChart() {
  const sensorData = useContext(SensorContext);

  if (!sensorData) return <p className="text-gray-500">Cargando Gases Combustibles...</p>;
  return (
    <SensorChart
      title="VOC (Contaminantes Volatiles Organicos)"
      currentValue={sensorData.co2}
      unit="raw"
      color="#a59c87ff"
      maxPoints={1}
      minPoints={0}
    />
  );
}