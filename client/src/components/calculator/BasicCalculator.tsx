import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type CalculationHistory } from "@shared/schema";
import { evaluateExpression } from "@/lib/calculations";

interface BasicCalculatorProps {
  onCalculation: (calculation: Omit<CalculationHistory, "id" | "timestamp">) => void;
}

export default function BasicCalculator({ onCalculation }: BasicCalculatorProps) {
  const [display, setDisplay] = useState("0");
  const [operation, setOperation] = useState("");
  const [waitingForNumber, setWaitingForNumber] = useState(false);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [currentOperator, setCurrentOperator] = useState<string | null>(null);

  const handleNumber = (num: string) => {
    if (waitingForNumber) {
      setDisplay(num);
      setWaitingForNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (currentOperator) {
      const result = calculate(previousValue, current, currentOperator);
      setDisplay(result.toString());
      setPreviousValue(result);
    }
    
    setCurrentOperator(op);
    setWaitingForNumber(true);
    setOperation(`${display} ${op}`);
  };

  const calculate = (prev: number, current: number, operator: string): number => {
    switch (operator) {
      case "+":
        return prev + current;
      case "-":
        return prev - current;
      case "*":
        return prev * current;
      case "/":
        return prev / current;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (previousValue !== null && currentOperator) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, currentOperator);
      const expression = `${previousValue} ${currentOperator} ${current}`;
      
      setDisplay(result.toString());
      setOperation("");
      setPreviousValue(null);
      setCurrentOperator(null);
      setWaitingForNumber(true);
      
      onCalculation({
        type: "basic",
        expression,
        result: result.toString(),
      });
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setOperation("");
    setPreviousValue(null);
    setCurrentOperator(null);
    setWaitingForNumber(false);
  };

  const handleClearEntry = () => {
    setDisplay("0");
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleDecimal = () => {
    if (waitingForNumber) {
      setDisplay("0.");
      setWaitingForNumber(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const buttonClass = "py-4 px-6 rounded-lg text-lg font-semibold transition-colors";

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 text-white p-4">
        <div className="text-sm text-gray-400 mb-1 h-5">{operation}</div>
        <div className="text-3xl font-mono text-right">{display}</div>
      </Card>

      <div className="grid grid-cols-4 gap-3">
        <Button onClick={handleClear} className={`${buttonClass} bg-red-500 hover:bg-red-600`}>
          C
        </Button>
        <Button onClick={handleClearEntry} className={`${buttonClass} bg-orange-500 hover:bg-orange-600`}>
          CE
        </Button>
        <Button onClick={handleBackspace} className={`${buttonClass} bg-orange-500 hover:bg-orange-600`}>
          ⌫
        </Button>
        <Button onClick={() => handleOperator("/")} className={`${buttonClass} bg-blue-500 hover:bg-blue-600`}>
          ÷
        </Button>

        <Button onClick={() => handleNumber("7")} className={`${buttonClass} bg-gray-600 hover:bg-gray-700`}>
          7
        </Button>
        <Button onClick={() => handleNumber("8")} className={`${buttonClass} bg-gray-600 hover:bg-gray-700`}>
          8
        </Button>
        <Button onClick={() => handleNumber("9")} className={`${buttonClass} bg-gray-600 hover:bg-gray-700`}>
          9
        </Button>
        <Button onClick={() => handleOperator("*")} className={`${buttonClass} bg-blue-500 hover:bg-blue-600`}>
          ×
        </Button>

        <Button onClick={() => handleNumber("4")} className={`${buttonClass} bg-gray-600 hover:bg-gray-700`}>
          4
        </Button>
        <Button onClick={() => handleNumber("5")} className={`${buttonClass} bg-gray-600 hover:bg-gray-700`}>
          5
        </Button>
        <Button onClick={() => handleNumber("6")} className={`${buttonClass} bg-gray-600 hover:bg-gray-700`}>
          6
        </Button>
        <Button onClick={() => handleOperator("-")} className={`${buttonClass} bg-blue-500 hover:bg-blue-600`}>
          −
        </Button>

        <Button onClick={() => handleNumber("1")} className={`${buttonClass} bg-gray-600 hover:bg-gray-700`}>
          1
        </Button>
        <Button onClick={() => handleNumber("2")} className={`${buttonClass} bg-gray-600 hover:bg-gray-700`}>
          2
        </Button>
        <Button onClick={() => handleNumber("3")} className={`${buttonClass} bg-gray-600 hover:bg-gray-700`}>
          3
        </Button>
        <Button onClick={() => handleOperator("+")} className={`${buttonClass} bg-blue-500 hover:bg-blue-600`}>
          +
        </Button>

        <Button onClick={() => handleNumber("0")} className={`${buttonClass} bg-gray-600 hover:bg-gray-700 col-span-2`}>
          0
        </Button>
        <Button onClick={handleDecimal} className={`${buttonClass} bg-gray-600 hover:bg-gray-700`}>
          .
        </Button>
        <Button onClick={handleEquals} className={`${buttonClass} bg-green-500 hover:bg-green-600`}>
          =
        </Button>
      </div>
    </div>
  );
}
