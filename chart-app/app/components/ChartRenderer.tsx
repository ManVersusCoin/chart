// app/components/ChartRenderer.tsx
'use client';
import { useEffect, useState } from 'react';
import { DataSet, ChartConfig } from '../types';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip as ChartJSTooltip, Legend as ChartJSLegend } from 'chart.js';
import { Line as ChartJSLine, Bar as ChartJSBar, Pie as ChartJSPie, Scatter as ChartJSScatter } from 'react-chartjs-2';
import * as d3 from 'd3';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartJSTooltip,
  ChartJSLegend
);

// Colors for charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface ChartRendererProps {
  data: DataSet;
  config: ChartConfig;
  library?: 'recharts' | 'chartjs' | 'd3';
}

export default function ChartRenderer({ data, config, library = 'recharts' }: ChartRendererProps) {
  const [chartData, setChartData] = useState<DataSet>([]);
  
  // Process data for chart rendering
  useEffect(() => {
    if (!data || data.length === 0) return;
    
    // Filter out data points that don't have the required fields
    const filteredData = data.filter(item => 
      item[config.xAxis] !== undefined && 
      (config.type === 'pie' || item[config.yAxis] !== undefined)
    );
    
    // Limit data points for better performance
    const limitedData = filteredData.slice(0, 100);
    setChartData(limitedData);
  }, [data, config]);
  
  if (chartData.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <p>No valid data to display chart. Please check your data and selected fields.</p>
      </div>
    );
  }
  
  // Render with Recharts
  if (library === 'recharts') {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">{config.title}</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {renderRechartsChart(chartData, config)}
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
  
  // Render with Chart.js
  if (library === 'chartjs') {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">{config.title}</h3>
        <div className="h-96">
          {renderChartJSChart(chartData, config)}
        </div>
      </div>
    );
  }
  
  // Render with D3 (placeholder - D3 implementation would be more complex)
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">{config.title}</h3>
      <div className="h-96" id="d3-chart">
        <p>D3 chart would be rendered here. D3 implementation requires direct DOM manipulation.</p>
      </div>
    </div>
  );
}

// Function to render different Recharts chart types
function renderRechartsChart(data: DataSet, config: ChartConfig) {
  switch (config.type) {
    case 'line':
      return (
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={config.xAxis} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={config.yAxis} stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      );
      
    case 'bar':
      return (
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={config.xAxis} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={config.yAxis} fill="#8884d8" />
        </BarChart>
      );
      
    case 'pie':
      return (
        <PieChart>
          <Pie
            data={data}
            dataKey={config.yAxis}
            nameKey={config.xAxis}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      );
      
    case 'scatter':
      return (
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid />
          <XAxis type="number" dataKey={config.xAxis} name={config.xAxis} />
          <YAxis type="number" dataKey={config.yAxis} name={config.yAxis} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name={config.title} data={data} fill="#8884d8" />
        </ScatterChart>
      );
      
    case 'area':
      return (
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={config.xAxis} />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey={config.yAxis} stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      );
      
    default:
      return <div>Unsupported chart type</div>;
  }
}

// Function to render different Chart.js chart types
function renderChartJSChart(data: DataSet, config: ChartConfig) {
  // Extract labels and data values
  const labels = data.map(item => item[config.xAxis]);
  const values = data.map(item => item[config.yAxis]);
  
  const chartJsData = {
    labels,
    datasets: [
      {
        label: config.yAxis,
        data: values,
        backgroundColor: COLORS.map(color => color + '80'), // Add transparency
        borderColor: COLORS,
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: config.title,
      },
    },
  };
  
  switch (config.type) {
    case 'line':
      return <ChartJSLine data={chartJsData} options={options} />;
      
    case 'bar':
      return <ChartJSBar data={chartJsData} options={options} />;
      
    case 'pie':
      return <ChartJSPie data={chartJsData} options={options} />;
      
    case 'scatter':
      // Transform data for scatter plot
      const scatterData = {
        datasets: [
          {
            label: config.title,
            data: data.map(item => ({ 
              x: item[config.xAxis], 
              y: item[config.yAxis] 
            })),
            backgroundColor: COLORS[0],
          },
        ],
      };
      return <ChartJSScatter data={scatterData} options={options} />;
      
    default:
      return <div>Unsupported chart type in Chart.js</div>;
  }
}