// Mathematical calculation utilities

export const evaluateExpression = (expression: string): number => {
  // Basic math expression evaluator
  // This is a simplified version - in production, you'd use a proper math parser
  try {
    // Replace display symbols with actual operators
    const cleanExpression = expression
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-");
    
    // Use Function constructor for safe evaluation (limited scope)
    const result = new Function("return " + cleanExpression)();
    return result;
  } catch (error) {
    throw new Error("Invalid expression");
  }
};

export const scientificFunctions = {
  factorial: (n: number): number => {
    if (n < 0) throw new Error("Factorial of negative number");
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  },

  degreesToRadians: (degrees: number): number => {
    return degrees * (Math.PI / 180);
  },

  radiansToDegrees: (radians: number): number => {
    return radians * (180 / Math.PI);
  },
};

export const unitConversions = {
  length: {
    // All conversions to meters
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.34,
  },
  weight: {
    // All conversions to kilograms
    mg: 0.000001,
    g: 0.001,
    kg: 1,
    oz: 0.0283495,
    lb: 0.453592,
    ton: 1000,
  },
  volume: {
    // All conversions to liters
    ml: 0.001,
    l: 1,
    gal: 3.78541,
    qt: 0.946353,
    pt: 0.473176,
    cup: 0.236588,
    floz: 0.0295735,
  },
};

export const temperatureConversions = {
  celsiusToFahrenheit: (celsius: number): number => {
    return (celsius * 9/5) + 32;
  },
  fahrenheitToCelsius: (fahrenheit: number): number => {
    return (fahrenheit - 32) * 5/9;
  },
  celsiusToKelvin: (celsius: number): number => {
    return celsius + 273.15;
  },
  kelvinToCelsius: (kelvin: number): number => {
    return kelvin - 273.15;
  },
};
