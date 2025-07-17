import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip);

interface SensorChartProps {
  title: string;
  currentValue?: number;
  unit?: string;
  color?: string;
  maxPoints?: number;
  minPoints?: number;
}

export default function SensorChart({
  title,
  currentValue,
  unit = "",
  color = "#3b82f6",
  maxPoints = 100,
  minPoints = 20
}: SensorChartProps) {
  const [labels, setLabels] = useState<string[]>([]);
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  useEffect(() => {
    console.log("currentValue:", currentValue, "typeof:", typeof currentValue);
    if (typeof currentValue === "number" && !isNaN(currentValue)) {
      setLabels((prev) => [...prev.slice(-maxPoints + 1), new Date().toLocaleTimeString()]);
      setDataPoints((prev) => [...prev.slice(-maxPoints + 1), currentValue]);
    }
  }, [currentValue, maxPoints]);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${title} ${unit}`,
        data: dataPoints,
        borderColor: color,
        backgroundColor: color + "50",
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
      min: minPoints,     // mínimo valor en eje Y
      max: maxPoints,     // máximo valor en eje Y
      ticks: {
        stepSize: 5,         // intervalo entre marcas
        callback: (value: any) =>
          typeof value === "number" ? value.toFixed(0) : value,
      },
    },
      x: {
        ticks: {
          maxTicksLimit: 5,
        },
      },
    },
    animation: {
      duration: 300,
      easing: "linear",
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="w-full h-64 md:h-80 bg-white rounded-sm pb-3">
      <h3 className="mb-2 font-semibold bg-gray-200 rounded-lg border-1 border-gray-300 p-2">{title} : {currentValue} {unit}</h3>
      <Line data={chartData} options={options} />
    </div>
  );
}
