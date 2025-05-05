// app/components/Charts/PieChart.tsx
'use client';
import { ChartProps } from '@/app/types/chart';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data, fields, title }: ChartProps) {
  const { labels, values } = fields;
  
  if (!data || !labels || !values) {
    return <div className="p-4 text-gray-500">Please select fields to display chart</div>;
  }
  
  // Group by labels and sum values
  const groupedData: Record<string, number> = {};
  data.forEach(item => {
    const label = String(item[labels]);
    if (!groupedData[label]) {
      groupedData[label] = 0;
    }
    groupedData[label] += Number(item[values]) || 0;
  });
  
  const chartData = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        data: Object.values(groupedData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(199, 199, 199, 0.7)',
          'rgba(83, 102, 255, 0.7)',
          'rgba(40, 159, 64, 0.7)',
          'rgba(210, 199, 199, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(159, 159, 159, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(40, 159, 64, 1)',
          'rgba(210, 199, 199, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
  };
  
  return (
    <div className="h-80">
      <Pie data={chartData} options={options} />
    </div>
  );
}