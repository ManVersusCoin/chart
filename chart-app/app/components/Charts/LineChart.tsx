// app/components/Charts/LineChart.tsx
'use client';
import { ChartProps } from '@/app/types/chart';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
);

export default function LineChart({ data, fields, title }: ChartProps) {
  const { xAxis, yAxis, series } = fields;
  
  if (!data || !xAxis || !yAxis) {
    return <div className="p-4 text-gray-500">Please select fields to display chart</div>;
  }
  
  // Prepare data for the chart
  let chartData: any;
  
  if (series) {
    // Group by series
    const seriesValues = [...new Set(data.map(item => item[series]))];
    
    const labels = [...new Set(data.map(item => item[xAxis]))];
    
    const datasets = seriesValues.map((seriesValue, index) => {
      const seriesData = data.filter(item => item[series] === seriesValue);
      const dataPoints: Record<string, any> = {};
      
      // Create a map of x values to y values
      seriesData.forEach(item => {
        dataPoints[item[xAxis]] = item[yAxis];
      });
      
      // Map to the full set of labels
      const values = labels.map(label => dataPoints[label] || null);
      
      return {
        label: String(seriesValue),
        data: values,
        borderColor: getColor(index),
        backgroundColor: getColor(index, 0.2),
      };
    });
    
    chartData = {
      labels,
      datasets
    };
  } else {
    // Simple line chart
    chartData = {
      labels: data.map(item => item[xAxis]),
      datasets: [
        {
          label: yAxis,
          data: data.map(item => item[yAxis]),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }
      ]
    };
  }
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
  };
  
  return (
    <div className="h-80">
      <Line options={options} data={chartData} />
    </div>
  );
}

// Helper to generate colors
function getColor(index: number, alpha = 1): string {
  const colors = [
    `rgba(75, 192, 192, ${alpha})`,
    `rgba(255, 99, 132, ${alpha})`,
    `rgba(54, 162, 235, ${alpha})`,
    `rgba(255, 206, 86, ${alpha})`,
    `rgba(153, 102, 255, ${alpha})`,
    `rgba(255, 159, 64, ${alpha})`,
  ];
  
  return colors[index % colors.length];
}