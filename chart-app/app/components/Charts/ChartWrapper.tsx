// app/components/Charts/ChartWrapper.tsx
'use client';
import { ChartWrapperProps } from '@/app/types/chart';
import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';
import ScatterPlot from './ScatterPlot';

export default function ChartWrapper({ chartType, data, fields, title }: ChartWrapperProps) {
  if (!chartType) {
    return (
      <div className="p-6 bg-white rounded-lg shadow text-center">
        <p className="text-gray-500">Select a chart type to visualize your data</p>
      </div>
    );
  }
  
  const renderChart = () => {
    switch(chartType) {
      case 'line':
        return <LineChart data={data} fields={fields} title={title} />;
      case 'bar':
        return <BarChart data={data} fields={fields} title={title} />;
      case 'pie':
      case 'doughnut':
        return <PieChart data={data} fields={fields} title={title} />;
      case 'scatter':
        return <ScatterPlot data={data} fields={fields} title={title} />;
      default:
        return <div>Chart type not supported</div>;
    }
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-3">{title || 'Chart Visualization'}</h3>
      {renderChart()}
    </div>
  );
}