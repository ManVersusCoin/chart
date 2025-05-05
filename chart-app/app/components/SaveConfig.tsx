// app/components/SaveConfig.tsx
'use client';
import { useState } from 'react';
import { ChartConfig } from '../types';

interface SaveConfigProps {
  config: ChartConfig;
  onLoad: (config: ChartConfig) => void;
}

export default function SaveConfig({ config, onLoad }: SaveConfigProps) {
  const [savedConfigs, setSavedConfigs] = useState<{name: string, config: ChartConfig}[]>([]);
  const [configName, setConfigName] = useState<string>('');
  
  const saveCurrentConfig = () => {
    if (!configName.trim()) return;
    
    const newSavedConfigs = [
      ...savedConfigs,
      { name: configName, config: { ...config } }
    ];
    
    setSavedConfigs(newSavedConfigs);
    setConfigName('');
    
    // Also save to localStorage for persistence
    localStorage.setItem('savedChartConfigs', JSON.stringify(newSavedConfigs));
  };
  
  const loadConfig = (index: number) => {
    onLoad(savedConfigs[index].config);
  };
  
  const deleteConfig = (index: number) => {
    const newSavedConfigs = [...savedConfigs];
    newSavedConfigs.splice(index, 1);
    setSavedConfigs(newSavedConfigs);
    localStorage.setItem('savedChartConfigs', JSON.stringify(newSavedConfigs));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Save & Load Configurations</h3>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={configName}
          onChange={(e) => setConfigName(e.target.value)}
          placeholder="Configuration name"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={saveCurrentConfig}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={!configName.trim()}
        >
          Save Current
        </button>
      </div>
      
      {savedConfigs.length > 0 ? (
        <div className="space-y-2">
          <h4 className="font-medium">Saved Configurations</h4>
          {savedConfigs.map((saved, index) => (
            <div key={index} className="flex justify-between items-center p-2 border rounded">
              <span>{saved.name}</span>
              <div>
                <button
                  onClick={() => loadConfig(index)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm mr-2"
                >
                  Load
                </button>
                <button
                  onClick={() => deleteConfig(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No saved configurations yet.</p>
      )}
    </div>
  );
}