// app/components/DataUpload/JsonViewer.tsx
'use client';
import { useState } from 'react';

interface JsonViewerProps {
  data: any;
}

export default function JsonViewer({ data }: JsonViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!data) return null;
  
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Raw JSON Structure</h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="bg-gray-800 text-gray-200 p-4 rounded overflow-auto max-h-96">
          <pre className="text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}