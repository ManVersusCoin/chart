// app/components/DataUpload/FileUpload.tsx
'use client';
import { useState } from 'react';

interface FileUploadProps {
  onDataReceived: (data: any) => void;
}

export default function FileUpload({ onDataReceived }: FileUploadProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();
      
      // Try to extract an array from the JSON structure
      const processedData = extractDataArray(jsonData);
      
      if (processedData.length === 0) {
        throw new Error('Could not find usable data array in the JSON');
      }
      
      onDataReceived(processedData);
    } catch (error: any) {
      setError(`Error fetching data: ${error.message}`);
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);
          
          // Try to extract an array from the JSON structure
          const processedData = extractDataArray(jsonData);
          
          if (processedData.length === 0) {
            throw new Error('Could not find usable data array in the JSON');
          }
          
          onDataReceived(processedData);
        } catch (error: any) {
          setError(`Error parsing JSON: ${error.message}`);
          console.error('Error parsing JSON:', error);
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setError('Error reading file');
        setLoading(false);
      };
      reader.readAsText(file);
    }
  };
  
  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Upload Data</h2>
      
      <div className="mb-6">
        <p className="mb-2 font-medium">Upload JSON file:</p>
        <input 
          type="file" 
          accept=".json" 
          onChange={handleFileUpload}
          className="w-full border p-2 rounded bg-white" 
        />
      </div>
      
      <div className="mb-4">
        <p className="mb-2 font-medium">Or enter JSON URL:</p>
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input 
            type="url" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            placeholder="https://example.com/data.json"
            className="flex-1 border p-2 rounded" 
            required 
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

// Helper function to extract array data from various JSON structures
function extractDataArray(jsonData: any): any[] {
  // If it's already an array, return it
  if (Array.isArray(jsonData)) {
    return jsonData;
  }
  
  // If it's an object, look for array properties
  if (typeof jsonData === 'object' && jsonData !== null) {
    // Try to find properties that contain arrays
    for (const key in jsonData) {
      if (Array.isArray(jsonData[key]) && jsonData[key].length > 0) {
        return jsonData[key];
      }
    }
    
    // Try to find nested objects that might contain arrays
    for (const key in jsonData) {
      if (typeof jsonData[key] === 'object' && jsonData[key] !== null) {
        const nestedArray = extractDataArray(jsonData[key]);
        if (nestedArray.length > 0) {
          return nestedArray;
        }
      }
    }
    
    // If no arrays found, try to convert the object to an array of key-value pairs
    if (Object.keys(jsonData).length > 0) {
      return [jsonData];
    }
  }
  
  return [];
}