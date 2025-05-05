// app/types/index.ts
export interface DataPoint {
    [key: string]: any;
  }
  
  export type DataSet = DataPoint[];
  
  export interface ChartConfig {
    type: 'line' | 'bar' | 'pie' | 'scatter' | 'area';
    title: string;
    xAxis: string;
    yAxis: string;
    color?: string;
  }