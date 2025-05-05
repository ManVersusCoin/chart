// app/utils/dataParser.ts
/**
 * Analyzes data structure and finds potential chart fields
 */
export function analyzeData(data: any[]) {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      isValid: false,
      message: 'Data must be a non-empty array'
    };
  }

  // Flatten nested objects to make them more accessible for charting
  const flattenedData = data.map(flattenObject);

  // Analyze field types across all items
  const fieldTypes: Record<string, { types: Set<string>, count: number, isDate?: boolean }> = {};
  const sampleSize = Math.min(flattenedData.length, 100); // Check up to 100 items
  
  // First pass - collect all fields and their types
  for (let i = 0; i < sampleSize; i++) {
    const item = flattenedData[i];
    if (typeof item !== 'object' || item === null) continue;
    
    Object.keys(item).forEach(key => {
      const value = item[key];
      const typeInfo = getValueTypeInfo(value);
      
      if (!fieldTypes[key]) {
        fieldTypes[key] = { 
          types: new Set([typeInfo.type]), 
          count: 1,
          isDate: typeInfo.isDate
        };
      } else {
        fieldTypes[key].types.add(typeInfo.type);
        fieldTypes[key].count++;
        if (typeInfo.isDate) {
          fieldTypes[key].isDate = true;
        }
      }
    });
  }
  
  // Determine suitable fields for different chart types
  const numericFields: string[] = [];
  const categoryFields: string[] = [];
  const dateFields: string[] = [];
  const textFields: string[] = [];
  
  // For date fields, add derived time periods
  const derivedFields: Record<string, any> = {};
  
  Object.keys(fieldTypes).forEach(field => {
    const { types, count, isDate } = fieldTypes[field];
    const coverage = count / sampleSize;
    
    // Skip fields with low coverage
    if (coverage < 0.7) return;
    
    if (types.has('number')) {
      numericFields.push(field);
    }
    
    if (isDate) {
      dateFields.push(field);
      
      // Add derived date fields (year, month, day)
      derivedFields[`${field}_year`] = (item: any) => {
        if (!item[field]) return null;
        const date = new Date(item[field]);
        return date.getFullYear();
      };
      
      derivedFields[`${field}_month`] = (item: any) => {
        if (!item[field]) return null;
        const date = new Date(item[field]);
        return date.toLocaleString('default', { month: 'short' });
      };
      
      derivedFields[`${field}_day`] = (item: any) => {
        if (!item[field]) return null;
        const date = new Date(item[field]);
        return date.getDate();
      };
      
      // Add these derived fields to the appropriate categories
      categoryFields.push(`${field}_year`, `${field}_month`, `${field}_day`);
    }
    
    if (types.has('string')) {
      // If field has few unique values, it's likely a category
      const uniqueValues = new Set(flattenedData.map(item => item[field])).size;
      if (uniqueValues <= Math.min(20, flattenedData.length * 0.3)) {
        categoryFields.push(field);
      } else {
        textFields.push(field);
      }
    }
  });

  // Add derived fields to the data
  const enrichedData = flattenedData.map(item => {
    const newItem = { ...item };
    Object.entries(derivedFields).forEach(([field, deriveFn]) => {
      newItem[field] = deriveFn(item);
    });
    return newItem;
  });

  return {
    isValid: true,
    fields: {
      numeric: numericFields,
      category: categoryFields,
      date: dateFields,
      text: textFields
    },
    fieldTypes,
    totalRecords: flattenedData.length,
    data: enrichedData // Return the enriched data for use in charts
  };
}

/**
 * Flattens nested objects with dot notation
 * Example: { a: { b: 1 } } becomes { "a.b": 1 }
 */
function flattenObject(obj: any, prefix = ''): Record<string, any> {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return { [prefix]: obj };
  }

  return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
    const pre = prefix.length ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], pre));
    } else {
      acc[pre] = obj[key];
    }
    
    return acc;
  }, {});
}

/**
 * Determines the type of a value and checks if it's a date
 */
function getValueTypeInfo(value: any): { type: string, isDate: boolean } {
  if (value === null || value === undefined) {
    return { type: 'null', isDate: false };
  }
  
  if (typeof value === 'number') {
    return { type: 'number', isDate: false };
  }
  
  if (typeof value === 'boolean') {
    return { type: 'boolean', isDate: false };
  }
  
  if (typeof value === 'string') {
    // Check if it's a date
    const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
    const isDate = dateRegex.test(value) || !isNaN(Date.parse(value));
    
    // Check if it's a numeric string
    if (!isNaN(Number(value)) && value.trim() !== '') {
      return { type: 'number', isDate: false };
    }
    
    return { type: 'string', isDate };
  }
  
  if (Array.isArray(value)) {
    return { type: 'array', isDate: false };
  }
  
  if (typeof value === 'object') {
    return { type: 'object', isDate: false };
  }
  
  return { type: typeof value, isDate: false };
}

/**
 * Suggests appropriate chart types based on field analysis
 */
export function suggestChartTypes(analysis: any): string[] {
  if (!analysis.isValid) return [];
  
  const suggestions: string[] = [];
  const { numeric, category, date } = analysis.fields;
  
  if (numeric.length > 0 && (category.length > 0 || date.length > 0)) {
    suggestions.push('bar', 'line');
    
    if (numeric.length >= 2) {
      suggestions.push('scatter');
    }
  }
  
  if (category.length > 0 && numeric.length > 0) {
    suggestions.push('pie', 'doughnut');
  }
  
  if (date.length > 0 && numeric.length > 0) {
    suggestions.push('line', 'area');
  }
  
  // Default if no good suggestions
  if (suggestions.length === 0 && numeric.length > 0) {
    suggestions.push('bar');
  }
  
  return [...new Set(suggestions)];
}