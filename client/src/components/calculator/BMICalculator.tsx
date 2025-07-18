import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { type CalculationHistory } from "@shared/schema";

interface BMICalculatorProps {
  onCalculation: (calculation: Omit<CalculationHistory, "id" | "timestamp">) => void;
}

export default function BMICalculator({ onCalculation }: BMICalculatorProps) {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");

  const getBMICategory = (bmiValue: number): string => {
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 25) return "Normal weight";
    if (bmiValue < 30) return "Overweight";
    return "Obese";
  };

  const getBMIColor = (bmiValue: number): string => {
    if (bmiValue < 18.5) return "text-blue-600";
    if (bmiValue < 25) return "text-green-600";
    if (bmiValue < 30) return "text-yellow-600";
    return "text-red-600";
  };

  const calculateBMI = () => {
    if (!weight || !height) return;

    let weightInKg = parseFloat(weight);
    let heightInM = parseFloat(height);

    // Convert weight to kg if needed
    if (weightUnit === "lbs") {
      weightInKg = weightInKg * 0.453592;
    }

    // Convert height to meters if needed
    if (heightUnit === "cm") {
      heightInM = heightInM / 100;
    } else if (heightUnit === "ft") {
      heightInM = heightInM * 0.3048;
    } else if (heightUnit === "in") {
      heightInM = heightInM * 0.0254;
    }

    const bmiValue = weightInKg / (heightInM * heightInM);
    const bmiCategory = getBMICategory(bmiValue);

    setBmi(bmiValue);
    setCategory(bmiCategory);

    onCalculation({
      type: "bmi",
      expression: `BMI: ${weight}${weightUnit}, ${height}${heightUnit}`,
      result: bmiValue.toFixed(2),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
          Weight
        </Label>
        <div className="flex gap-2">
          <Input
            id="weight"
            type="number"
            placeholder="Enter weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="flex-1"
          />
          <Select value={weightUnit} onValueChange={setWeightUnit}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="lbs">lbs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
          Height
        </Label>
        <div className="flex gap-2">
          <Input
            id="height"
            type="number"
            placeholder="Enter height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="flex-1"
          />
          <Select value={heightUnit} onValueChange={setHeightUnit}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cm">cm</SelectItem>
              <SelectItem value="ft">ft</SelectItem>
              <SelectItem value="in">in</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={calculateBMI} className="w-full bg-primary hover:bg-blue-700">
        Calculate BMI
      </Button>

      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {bmi ? bmi.toFixed(2) : "--"}
            </div>
            <div className={`text-lg mb-4 ${bmi ? getBMIColor(bmi) : "text-gray-600"}`}>
              {category || "Enter your details to calculate BMI"}
            </div>
            <div className="text-sm text-gray-500">
              Normal BMI range: 18.5 - 24.9
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50">
        <CardContent className="pt-4">
          <h3 className="font-semibold text-gray-800 mb-2">BMI Categories</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-600">Underweight:</span>
              <span>Below 18.5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Normal weight:</span>
              <span>18.5 - 24.9</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-600">Overweight:</span>
              <span>25 - 29.9</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Obese:</span>
              <span>30 and above</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
