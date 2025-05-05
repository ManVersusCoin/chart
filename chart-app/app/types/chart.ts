// app/types/chart.ts
export interface ChartField {
    [key: string]: string;
  }
  
  export interface ChartProps {
    data: any[];
    fields: ChartField;
    title?: string;
  }
  
  export interface ChartTypeOption {
    type: string;
    label: string;
    icon: string;
  }
  
  export interface ChartTypeSelectorProps {
    suggestedTypes: string[];
    selectedType: string;
    onTypeChange: (type: string) => void;
  }
  
  export interface FieldConfig {
    name: string;
    label: string;
    options: string[];
    required: boolean;
  }
  
  export interface FieldSelectorProps {
    dataAnalysis: any;
    selectedFields: ChartField;
    onFieldChange: (fieldName: string, value: string) => void;
    chartType: string;
  }
  
  export interface ChartWrapperProps {
    chartType: string;
    data: any[];
    fields: ChartField;
    title?: string;
  }