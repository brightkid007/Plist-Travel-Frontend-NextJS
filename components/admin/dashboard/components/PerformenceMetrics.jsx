"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,

  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },

    tooltips: {
      position: "nearest",
      mode: "index",
      intersect: false,
      yPadding: 10,
      xPadding: 10,
      caretSize: 4,
      backgroundColor: "rgba(72, 241, 12, 1)",
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "#1967d2",
      borderColor: "rgba(0,0,0,1)",
      borderWidth: 4,
    },
  },
};

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const data = {
  labels,
  datasets: [
    {
      label: "Occupancy Rate (%)",
      borderColor: "#ff0000",
      backgroundColor: "#ff0000",
      tension: 0.2,
      data: [
        8000, 7400, 9000, 5000, 7000, 7200, 5600, 5500, 7800, 6500, 7300, 8100,
      ],
      fill: false,
    },
    {
      label: "Average Daily Rate ($)",
      borderColor: "#00ff00",
      backgroundColor: "#00ff00",
      tension: 0.2,
      data: [
        5000, 6400, 6500, 5500, 7300, 6800, 7000, 6000, 7000, 6500, 7500, 8000,
      ],
      fill: false,
    },
    {
      label: "Revenue per Available Room ($)",
      borderColor: "#0000ff",
      backgroundColor: "#0000ff",
      tension: 0.2,
      data: [
        6000, 6900, 7500, 5200, 6800, 7000, 6300, 5800, 7400, 6700, 7100, 7900,
      ],
      fill: false,
    },
  ],
};

const PerformenceMetrics = ({ metrics = data }) => {
  const chartData = metrics && metrics.labels && metrics.datasets ? {
    labels: metrics.labels,
    datasets: metrics.datasets,
  } : data;
  return (
    <div className="widget-content">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default PerformenceMetrics;
