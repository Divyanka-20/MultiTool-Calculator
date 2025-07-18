import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { type CalculationHistory } from "@shared/schema";

interface UnitConverterProps {
  onCalculation: (calculation: Omit<CalculationHistory, "id" | "timestamp">) => void;
}

const unitOptions = {
  length: [
    { value: "mm", text: "Millimeter (mm)", factor: 0.001 },
    { value: "cm", text: "Centimeter (cm)", factor: 0.01 },
    { value: "m", text: "Meter (m)", factor: 1 },
    { value: "km", text: "Kilometer (km)", factor: 1000 },
    { value: "in", text: "Inch (in)", factor: 0.0254 },
    { value: "ft", text: "Foot (ft)", factor: 0.3048 },
    { value: "yd", text: "Yard (yd)", factor: 0.9144 },
    { value: "mi", text: "Mile (mi)", factor: 1609.34 },
  ],
  weight: [
    { value: "mg", text: "Milligram (mg)", factor: 0.000001 },
    { value: "g", text: "Gram (g)", factor: 0.001 },
    { value: "kg", text: "Kilogram (kg)", factor: 1 },
    { value: "oz", text: "Ounce (oz)", factor: 0.0283495 },
    { value: "lb", text: "Pound (lb)", factor: 0.453592 },
    { value: "ton", text: "Ton", factor: 1000 },
  ],
  temperature: [
    { value: "c", text: "Celsius (°C)", factor: 1 },
    { value: "f", text: "Fahrenheit (°F)", factor: 1 },
    { value: "k", text: "Kelvin (K)", factor: 1 },
  ],
  volume: [
    { value: "ml", text: "Milliliter (ml)", factor: 0.001 },
    { value: "l", text: "Liter (l)", factor: 1 },
    { value: "gal", text: "Gallon (gal)", factor: 3.78541 },
    { value: "qt", text: "Quart (qt)", factor: 0.946353 },
    { value: "pt", text: "Pint (pt)", factor: 0.473176 },
    { value: "cup", text: "Cup", factor: 0.236588 },
    { value: "floz", text: "Fluid Ounce (fl oz)", factor: 0.0295735 },
  ],
};

export default function UnitConverter({ onCalculation }: UnitConverterProps) {
  const [unitType, setUnitType] = useState<keyof typeof unitOptions>("length");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");

  useEffect(() => {
    const options = unitOptions[unitType];
    setFromUnit(options[0].value);
    setToUnit(options[1]?.value || options[0].value);
  }, [unitType]);

  const convertTemperature = (value: number, from: string, to: string): number => {
    // Convert to Celsius first
    let celsius = value;
    if (from === "f") {
      celsius = (value - 32) * 5/9;
    } else if (from === "k") {
      celsius = value - 273.15;
    }

    // Convert from Celsius to target
    if (to === "f") {
      return celsius * 9/5 + 32;
    } else if (to === "k") {
      return celsius + 273.15;
    }
    return celsius;
  };

  const convertUnits = () => {
    if (!fromValue || !fromUnit || !toUnit) return;

    const value = parseFloat(fromValue);
    let result: number;

    if (unitType === "temperature") {
      result = convertTemperature(value, fromUnit, toUnit);
    } else {
      const options = unitOptions[unitType];
      const fromFactor = options.find(u => u.value === fromUnit)?.factor || 1;
      const toFactor = options.find(u => u.value === toUnit)?.factor || 1;
      
      // Convert to base unit, then to target unit
      result = (value * fromFactor) / toFactor;
    }

    setToValue(result.toString());

    const fromUnitText = unitOptions[unitType].find(u => u.value === fromUnit)?.text || fromUnit;
    const toUnitText = unitOptions[unitType].find(u => u.value === toUnit)?.text || toUnit;

    onCalculation({
      type: "unit",
      expression: `${value} ${fromUnitText} to ${toUnitText}`,
      result: `${result} ${toUnitText}`,
    });
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    const tempValue = fromValue;
    
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
    setToValue(tempValue);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          Conversion Type
        </Label>
        <Select value={unitType} onValueChange={(value: keyof typeof unitOptions) => setUnitType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="length">Length</SelectItem>
            <SelectItem value="weight">Weight</SelectItem>
            <SelectItem value="temperature">Temperature</SelectItem>
            <SelectItem value="volume">Volume</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-2">From</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Enter value"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            className="flex-1"
          />
          <Select value={fromUnit} onValueChange={setFromUnit}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {unitOptions[unitType].map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-2">To</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Result"
            value={toValue}
            readOnly
            className="flex-1"
          />
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {unitOptions[unitType].map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={swapUnits}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      <Button onClick={convertUnits} className="w-full bg-primary hover:bg-blue-700">
        Convert
      </Button>
    </div>
  );
}
