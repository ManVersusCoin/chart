// app/components/ChartControls/FieldSelector.tsx
'use client';
import { FieldConfig, FieldSelectorProps } from '@/app/types/chart';

export default function FieldSelector({ 
  dataAnalysis, 
  selectedFields, 
  onFieldChange,
  chartType 
}: FieldSelectorProps) {
  if (!dataAnalysis || !dataAnalysis.isValid) {
    return null;
  }
  
  const { numeric, category, date } = dataAnalysis.fields;
  
  // Different chart types need different field configurations
  const getFieldConfig = (): FieldConfig[] => {
    switch(chartType) {
      case 'line':
      case 'area':
        return [
          { name: 'xAxis', label: 'X-Axis', options: [...date, ...category], required: true },
          { name: 'yAxis', label: 'Y-Axis', options: numeric, required: true },
          { name: 'series', label: 'Series (optional)', options: category, required: false }
        ];
      case 'bar':
        return [
          { name: 'xAxis', label: 'X-Axis', options: [...category, ...date], required: true },
          { name: 'yAxis', label: 'Y-Axis', options: numeric, required: true },
          { name: 'series', label: 'Series (optional)', options: category, required: false }
        ];
      case 'pie':
      case 'doughnut':
        return [
          { name: 'labels', label: 'Labels', options: category, required: true },
          { name: 'values', label: 'Values', options: numeric, required: true }
        ];
      case 'scatter':
        return [
          { name: 'xAxis', label: 'X-Axis', options: [...numeric, ...date], required: true },
          { name: 'yAxis', label: 'Y-Axis', options: numeric, required: true },
          { name: 'size', label: 'Point Size (optional)', options: numeric, required: false },
          { name: 'color', label: 'Color (optional)', options: category, required: false }
        ];
      default:
        return [
          { name: 'xAxis', label: 'X-Axis', options: [...category, ...date], required: true },
          { name: 'yAxis', label: 'Y-Axis', options: numeric, required: true }
        ];
    }
  };
  
  const fieldConfig = getFieldConfig();
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-3">Select Fields</h3>
      
      {fieldConfig.map(({ name, label, options, required }) => (
        <div key={name} className="mb-4">
          <label className="block mb-1 font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <select
            value={selectedFields[name] || ''}
            onChange={(e) => onFieldChange(name, e.target.value)}
            className="w-full p-2 border rounded"
            required={required}
          >
            <option value="">Select a field</option>
            {options.map(field => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}