import TempChart from "./TempChart";
import HumChart from "./HumidityChart";
import CO2Chart from "./CO2Chart";
import Card from "./Card";
import Contaminants from "./Contaminants";

export default function Charts() {
  return (
    <>
      <div className="content-center">
        <h2 className="text-center text-foreground text-2xl font-bold mb-4">Dashboard</h2>
      </div>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Temperatura">
          <TempChart />
        </Card>
        <Card title="Humedad">
          <HumChart />
        </Card>
        <Card title="Combustibles contaminantes volatiles">
          <CO2Chart />
        </Card>
        <Card title="Gases Contaminantes">
          <Contaminants />
        </Card>
      </div>
    </>
  );
}
