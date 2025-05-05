// app/components/DataUpload/DataPreview.tsx
'use client';
import { useState } from 'react';

interface DataPreviewProps {
  data: any[];
}

export default function DataPreview({ data }: DataPreviewProps) {
  const [previewRows, setPreviewRows] = useState(5);
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        No valid data to preview. Please upload an array of objects.
      </div>
    );
  }
  
  // Get all unique keys from the data
  const allKeys = Array.from(
    new Set(data.flatMap(item => Object.keys(item)))
  ).slice(0, 50); // Limit to 50 columns for better display
  
  return (
    <div className="mt-6 overflow-x-auto">
      <h3 className="text-lg font-bold mb-2">Data Preview</h3>
      <p className="mb-2 text-sm text-gray-600">
        Showing {Math.min(previewRows, data.length)} of {data.length} records
        {allKeys.length > 50 && " (limiting to first 50 columns)"}
      </p>
      
      <table className="min-w-full border border-gray-200 rounded">
        <thead className="bg-gray-50">
          <tr>
            {allKeys.map(key => (
              <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b truncate max-w-xs">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.slice(0, previewRows).map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {allKeys.map(key => (
                <td key={`${index}-${key}`} className="px-4 py-2 text-sm text-gray-500 border-b truncate max-w-xs">
                  {formatCellValue(item[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-2">
        <button 
          onClick={() => setPreviewRows(prev => Math.min(prev + 5, data.length))}
          disabled={previewRows >= data.length}
          className="text-sm text-blue-500 hover:text-blue-700 disabled:text-gray-400"
        >
          Show more rows
        </button>
      </div>
    </div>
  );
}

function formatCellValue(value: any): string {
  if (value === null || value === undefined) return 'null';
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value).substring(0, 50) + (JSON.stringify(value).length > 50 ? '...' : '');
    } catch (e) {
      return '[Complex Object]';
    }
  }
  
  return String(value);
}