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
  color = "#ffffffff",
  maxPoints = 100,
  minPoints = 20,
}: SensorChartProps) {
  const [labels, setLabels] = useState<string[]>([]);
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  useEffect(() => {
    if (typeof currentValue === "number" && !isNaN(currentValue)) {
      setLabels((prev) => [...prev.slice(-maxPoints + 1), new Date().toLocaleTimeString()]);
      setDataPoints((prev) => [...prev.slice(-maxPoints + 1), currentValue]);
    }
  }, [currentValue, maxPoints]);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${unit}`,
        data: dataPoints,
        borderColor: color,
        backgroundColor: color,
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
        min: minPoints,
        max: maxPoints,
        ticks: {
          color: "#ffffff",
          stepSize: 5,
          callback: (value: any) =>
            typeof value === "number" ? value.toFixed(0) : value,
        },
      grid: {
        color: "#4d4c4cff"
      },
      },
      x: {
        ticks: {
          maxTicksLimit: 5,
          color: "#ffffff",
        },
        grid: {
          color: "#4d4c4cff"
        },
      },
    },
    animation: {
      duration: 300,
      easing: "linear" as const,
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
    <div className="w-full h-[280px] md:h-[400px] bg-chart text-chart pb-3 flex flex-col rounded-md border border-border">
      <h3 className="mb-2 font-semibold border-b border-border p-2 flex-shrink-0 text-sm md:text-base">
        {title} : {currentValue?.toFixed(2)} {unit}
      </h3>
      <div className="flex-grow">
        <Line data={chartData} options={options} className="object-contain w-full h-full" />
      </div>
    </div>
  );
}
