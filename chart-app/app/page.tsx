// app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import FileUpload from './components/DataUpload/FileUpload';
import DataPreview from './components/DataUpload/DataPreview';
import ChartTypeSelector from './components/ChartControls/ChartTypeSelector';
import FieldSelector from './components/ChartControls/FieldSelector';
import ChartWrapper from './components/Charts/ChartWrapper';
import JsonViewer from './components/DataUpload/JsonViewer';
import { analyzeData, suggestChartTypes } from './utils/dataParser';


export default function Home() {
  const [rawData, setRawData] = useState<any[] | null>(null);
  const [processedData, setProcessedData] = useState<any[] | null>(null);
  const [dataAnalysis, setDataAnalysis] = useState<any>(null);
  const [suggestedCharts, setSuggestedCharts] = useState<string[]>([]);
  const [chartType, setChartType] = useState('');
  const [selectedFields, setSelectedFields] = useState<Record<string, string>>({});
  const [chartTitle, setChartTitle] = useState('');
  
  // Analyze data when it changes
  useEffect(() => {
    if (rawData) {
      const analysis = analyzeData(rawData);
      setDataAnalysis(analysis);
      
      if (analysis.isValid) {
        // Use the flattened data for visualization
        setProcessedData(analysis.data);
        
        const suggestions = suggestChartTypes(analysis);
        setSuggestedCharts(suggestions);
        
        // Auto-select first suggested chart type
        if (suggestions.length > 0 && !chartType) {
          setChartType(suggestions[0]);
        }
      }
    }
  }, [rawData]);
  
  // Reset selected fields when chart type changes
  useEffect(() => {
    setSelectedFields({});
  }, [chartType]);
  
  const handleFieldChange = (fieldName: string, value: string) => {
    setSelectedFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  
  return (
    <main className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Data Visualization App</h1>
      
      {/* Data Upload Section */}
      <section className="mb-8">
        <FileUpload onDataReceived={setRawData} />
      </section>
      // Update in app/page.tsx - add after the FileUpload section
      {rawData && (
        <section className="mb-8">
          <JsonViewer data={rawData} />
        </section>
      )}
      {/* Data Preview Section */}
      {processedData && (
        <section className="mb-8">
          <DataPreview data={processedData} />
        </section>
      )}
      
      {/* Chart Configuration Section */}
      {dataAnalysis && dataAnalysis.isValid && (
        <section className="mb-8 grid gap-6 md:grid-cols-2">
          <div>
            <ChartTypeSelector 
              suggestedTypes={suggestedCharts}
              selectedType={chartType}
              onTypeChange={setChartType}
            />
            
            {chartType && (
              <div className="mt-4">
                <FieldSelector 
                  dataAnalysis={dataAnalysis}
                  selectedFields={selectedFields}
                  onFieldChange={handleFieldChange}
                  chartType={chartType}
                />
              </div>
            )}
            
            {/* Chart Title Input */}
            <div className="mt-4 p-4 bg-white rounded-lg shadow">
              <label className="block mb-1 font-medium">Chart Title</label>
              <input
                type="text"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                placeholder="Enter chart title"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          {/* Chart Visualization */}
          <div>
            <ChartWrapper 
              chartType={chartType}
              data={processedData}
              fields={selectedFields}
              title={chartTitle}
            />
          </div>
        </section>
      )}
    </main>
  );
}