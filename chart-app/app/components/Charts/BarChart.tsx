// app/components/Charts/BarChart.tsx
'use client';
import { ChartProps } from '@/app/types/chart';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function BarChart({ data, fields, title }: ChartProps) {
  const { xAxis, yAxis, series } = fields;
  
  if (!data || !xAxis || !yAxis) {
    return <div className="p-4 text-gray-500">Please select fields to display chart</div>;
  }
  
  // Prepare data for chart
  let chartData: any[];
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];
  
  if (series) {
    // Group by x-axis and series
    const groupedData: Record<string, any> = {};
    const seriesValues = new Set<string>();
    
    data.forEach(item => {
      const xValue = item[xAxis];
      const seriesValue = item[series];
      seriesValues.add(String(seriesValue));
      
      if (!groupedData[xValue]) {
        groupedData[xValue] = { [xAxis]: xValue };
      }
      
      groupedData[xValue][seriesValue] = item[yAxis];
    });
    
    chartData = Object.values(groupedData);
    
    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            {[...seriesValues].map((value, index) => (
              <Bar 
                key={value} 
                dataKey={value} 
                fill={colors[index % colors.length]} 
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    );
  } else {
    // Simple bar chart
    chartData = data.map(item => ({
      [xAxis]: item[xAxis],
      [yAxis]: item[yAxis]
    }));
    
    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yAxis} fill="#8884d8" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}