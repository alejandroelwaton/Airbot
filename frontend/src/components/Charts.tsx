import { useContext } from "react";
import { SensorContext } from "../context/SensorContext";
import TempChart from "./TempChart";
import HumChart from "./HumidityChart";
import CO2Chart from "./CO2Chart";
import Card from "./Card";

export default function Charts() {
  const sensorData = useContext(SensorContext);
  
  return (
    <>
      <div className="content-center">
        <h2 className="text-display-center">Dashboard</h2>
      </div>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Temperatura">
          <TempChart />
        </Card>
        <Card title="Humedad">
          <HumChart />
        </Card>
        <Card title="Dioxido de carbono">
          <CO2Chart />
        </Card>
      </div>
    </>
  );
}
