import { useContext } from "react";
import { SensorContext } from "../context/SensorContext";
import SensorChart from "./SensorChart";

export default function Contaminants() {
  const sensorData = useContext(SensorContext);

  if (!sensorData) return <p className="text-gray-500">Cargando Gases Combustibles...</p>;
  return (
    <SensorChart
      title="VOC (Gases contaminantes)"
      currentValue={sensorData.co}
      unit="ppm"
      color="#a77e28ff"
      maxPoints={50}
      minPoints={0}
    />
  );
}