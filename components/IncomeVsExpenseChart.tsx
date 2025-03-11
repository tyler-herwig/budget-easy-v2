import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ChartOptions,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Income } from "@/types/income";
import moment from "moment";

interface IncomeVsExpenseChartProps {
  incomes: Income[] | undefined;
}

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const IncomeVsExpensesChart: React.FC<IncomeVsExpenseChartProps> = ({
  incomes,
}) => {
  const chartData = {
    labels: incomes?.map((income) =>
      moment(income.date_received).format("MMMM Do, YYYY")
    ),
    datasets: [
      {
        label: "Income",
        data: incomes?.map((income) => income.amount),
        borderColor: "#66bb6a",
        backgroundColor: "#66bb6a",
        fill: false
      },
      {
        label: "Expenses",
        data: incomes?.map((income) => income.total_expenses ?? 0),
        borderColor: "#90caf9",
        backgroundColor: "#90caf9",
        fill: false
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem) {
            const value = Number(tooltipItem.raw);
            return "$" + value.toLocaleString();
          },
        },
      },
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        },
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value.toLocaleString();
          },
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default IncomeVsExpensesChart;
