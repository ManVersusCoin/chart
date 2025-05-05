// app/components/Charts/ScatterPlot.tsx
'use client';
import { ChartProps } from '@/app/types/chart';
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function ScatterPlot({ data, fields, title }: ChartProps) {
  const { xAxis, yAxis, size, color } = fields;
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  useEffect(() => {
    if (!data || !xAxis || !yAxis || !svgRef.current) return;
    
    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Set up dimensions
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => +d[xAxis]) as [number, number])
      .range([0, innerWidth])
      .nice();
    
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => +d[yAxis]) as [number, number])
      .range([innerHeight, 0])
      .nice();
    
    // Size scale (optional)
    const sizeScale = size 
      ? d3.scaleLinear()
          .domain(d3.extent(data, d => +d[size]) as [number, number])
          .range([4, 15])
      : () => 6;
    
    // Color scale (optional)
    let colorScale: d3.ScaleOrdinal<string, string, never>;
    if (color) {
      const uniqueValues = [...new Set(data.map(d => d[color]))];
      colorScale = d3.scaleOrdinal<string>()
        .domain(uniqueValues.map(String))
        .range(d3.schemeCategory10);
    }
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('fill', '#000')
      .attr('x', innerWidth / 2)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(xAxis);
    
    svg.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .text(yAxis);
    
    // Add title
    if (title) {
      svg.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', -15)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .text(title);
    }
    
    // Add points
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(+d[xAxis]))
      .attr('cy', d => yScale(+d[yAxis]))
      .attr('r', d => size ? sizeScale(+d[size]) : 6)
      .attr('fill', d => color ? colorScale(d[color]) : '#69b3a2')
      .attr('opacity', 0.7)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);
    
    // Add legend if using color
    if (color) {
      const legend = svg.append('g')
        .attr('transform', `translate(${innerWidth - 100}, 0)`);
      
      const uniqueValues = [...new Set(data.map(d => d[color]))];
      
      uniqueValues.forEach((value, i) => {
        const legendRow = legend.append('g')
          .attr('transform', `translate(0, ${i * 20})`);
        
        legendRow.append('rect')
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', colorScale(value));
        
        legendRow.append('text')
          .attr('x', 15)
          .attr('y', 10)
          .attr('text-anchor', 'start')
          .style('font-size', '12px')
          .text(String(value));
      });
    }
    
  }, [data, fields, title]);
  
  if (!data || !xAxis || !yAxis) {
    return <div className="p-4 text-gray-500">Please select fields to display chart</div>;
  }
  
  return (
    <div className="h-80 w-full">
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
}