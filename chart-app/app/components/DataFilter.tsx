// app/components/DataFilter.tsx
'use client';
import { useState } from 'react';
import { DataSet } from '../types';

interface DataFilterProps {
  data: DataSet;
  fields: string[];
  onFilteredData: (data: DataSet) => void;
}

export default function DataFilter({ data, fields, onFilteredData }: DataFilterProps) {
  const [filters, setFilters] = useState<{field: string, operator: string, value: string}[]>([]);
  
  const addFilter = () => {
    setFilters([...filters, { field: fields[0], operator: '=', value: '' }]);
  };
  
  const removeFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };
  
  const updateFilter = (index: number, field: string, value: any) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };
  
  const applyFilters = () => {
    let filteredData = [...data];
    
    filters.forEach(filter => {
      filteredData = filteredData.filter(item => {
        const fieldValue = item[filter.field];
        const filterValue = filter.value;
        
        switch (filter.operator) {
          case '=':
            return String(fieldValue) === filterValue;
          case '!=':
            return String(fieldValue) !== filterValue;
          case '>':
            return Number(fieldValue) > Number(filterValue);
          case '<':
            return Number(fieldValue) < Number(filterValue);
          case 'contains':
            return String(fieldValue).includes(filterValue);
          default:
            return true;
        }
      });
    });
    
    onFilteredData(filteredData);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filter Data</h3>
        <button 
          onClick={addFilter}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Add Filter
        </button>
      </div>
      
      {filters.length === 0 && (
        <p className="text-gray-500">No filters applied. Click "Add Filter" to filter your data.</p>
      )}
      
      {filters.map((filter, index) => (
        <div key={index} className="flex gap-2 items-center mb-3">
          <select
            value={filter.field}
            onChange={(e) => updateFilter(index, 'field', e.target.value)}
            className="p-2 border rounded"
          >
            {fields.map(field => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
          
          <select
            value={filter.operator}
            onChange={(e) => updateFilter(index, 'operator', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="=">equals</option>
            <option value="!=">not equals</option>
            <option value=">">greater than</option>
            <option value="<">less than</option>
            <option value="contains">contains</option>
          </select>
          
          <input
            type="text"
            value={filter.value}
            onChange={(e) => updateFilter(index, 'value', e.target.value)}
            className="p-2 border rounded flex-1"
            placeholder="Value"
          />
          
          <button
            onClick={() => removeFilter(index)}
            className="p-2 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      ))}
      
      {filters.length > 0 && (
        <button
          onClick={applyFilters}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Apply Filters
        </button>
      )}
    </div>
  );
}