// app/components/ChartControls/ChartTypeSelector.tsx
'use client';
import { ChartTypeOption, ChartTypeSelectorProps } from '@/app/types/chart';

const chartOptions: ChartTypeOption[] = [
  { type: 'line', label: 'Line Chart', icon: '📈' },
  { type: 'bar', label: 'Bar Chart', icon: '📊' },
  { type: 'pie', label: 'Pie Chart', icon: '🥧' },
  { type: 'doughnut', label: 'Doughnut Chart', icon: '🍩' },
  { type: 'scatter', label: 'Scatter Plot', icon: '✨' },
  { type: 'area', label: 'Area Chart', icon: '🏔️' },
];

export default function ChartTypeSelector({ 
  suggestedTypes = [], 
  selectedType, 
  onTypeChange 
}: ChartTypeSelectorProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-3">Select Chart Type</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {chartOptions.map(({ type, label, icon }) => {
          const isSuggested = suggestedTypes.includes(type);
          
          return (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`
                p-3 rounded-lg border transition-all
                ${selectedType === type 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:bg-gray-50'}
                ${isSuggested ? 'font-medium' : 'text-gray-500'}
              `}
            >
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-sm">
                {label}
                {isSuggested && (
                  <span className="ml-1 text-xs text-green-600">✓</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}