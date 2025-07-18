import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type CalculationHistory } from "@shared/schema";
import { evaluateExpression, scientificFunctions } from "@/lib/calculations";

interface ScientificCalculatorProps {
  onCalculation: (calculation: Omit<CalculationHistory, "id" | "timestamp">) => void;
}

export default function ScientificCalculator({ onCalculation }: ScientificCalculatorProps) {
  const [display, setDisplay] = useState("0");
  const [operation, setOperation] = useState("");
  const [expression, setExpression] = useState("");

  const handleNumber = (num: string) => {
    if (display === "0" || display === "Error") {
      setDisplay(num);
      setExpression(num);
    } else {
      setDisplay(display + num);
      setExpression(expression + num);
    }
  };

  const handleOperator = (op: string) => {
    const symbol = op === "*" ? "×" : op === "/" ? "÷" : op === "-" ? "−" : op;
    setDisplay(display + " " + symbol + " ");
    setExpression(expression + op);
    setOperation(display + " " + symbol);
  };

  const handleFunction = (func: string) => {
    try {
      const current = parseFloat(display);
      let result: number;
      
      switch (func) {
        case "sin":
          result = Math.sin(current * Math.PI / 180);
          break;
        case "cos":
          result = Math.cos(current * Math.PI / 180);
          break;
        case "tan":
          result = Math.tan(current * Math.PI / 180);
          break;
        case "log":
          result = Math.log10(current);
          break;
        case "ln":
          result = Math.log(current);
          break;
        case "sqrt":
          result = Math.sqrt(current);
          break;
        case "power":
          result = Math.pow(current, 2);
          break;
        case "factorial":
          result = scientificFunctions.factorial(current);
          break;
        case "reciprocal":
          result = 1 / current;
          break;
        case "abs":
          result = Math.abs(current);
          break;
        case "percent":
          result = current / 100;
          break;
        default:
          result = current;
      }
      
      const resultStr = result.toString();
      setDisplay(resultStr);
      setExpression(resultStr);
      setOperation("");
      
      onCalculation({
        type: "scientific",
        expression: `${func}(${current})`,
        result: resultStr,
      });
    } catch (error) {
      setDisplay("Error");
      setExpression("");
    }
  };

  const handleConstant = (constant: string) => {
    const value = constant === "pi" ? Math.PI : Math.E;
    setDisplay(value.toString());
    setExpression(value.toString());
  };

  const handleEquals = () => {
    try {
      const result = evaluateExpression(expression);
      const resultStr = result.toString();
      setDisplay(resultStr);
      setOperation("");
      
      onCalculation({
        type: "scientific",
        expression: expression,
        result: resultStr,
      });
      
      setExpression(resultStr);
    } catch (error) {
      setDisplay("Error");
      setExpression("");
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setOperation("");
    setExpression("");
  };

  const handleBackspace = () => {
    if (display.length > 1 && display !== "Error") {
      setDisplay(display.slice(0, -1));
      setExpression(expression.slice(0, -1));
    } else {
      setDisplay("0");
      setExpression("");
    }
  };

  const handleDecimal = () => {
    if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
      setExpression(expression + ".");
    }
  };

  const buttonClass = "py-3 px-4 rounded-lg text-sm font-semibold transition-colors";

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 text-white p-4">
        <div className="text-sm text-gray-400 mb-1 h-5">{operation}</div>
        <div className="text-3xl font-mono text-right">{display}</div>
      </Card>

      <div className="grid grid-cols-6 gap-2">
        <Button onClick={() => handleFunction("sin")} className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}>
          sin
        </Button>
        <Button onClick={() => handleFunction("cos")} className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}>
          cos
        </Button>
        <Button onClick={() => handleFunction("tan")} className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}>
          tan
        </Button>
        <Button onClick={() => handleFunction("log")} className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}>
          log
        </Button>
        <Button onClick={() => handleFunction("ln")} className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}>
          ln
        </Button>
        <Button onClick={handleClear} className={`${buttonClass} bg-red-500 hover:bg-red-600`}>
          C
        </Button>

        <Button onClick={() => handleFunction("sqrt")} className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}>
          √
        </Button>
        <Button onClick={() => handleFunction("power")} className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}>
          x²
        </Button>
        <Button onClick={() => handleOperator("^")} className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}>
          x^y
        </Button>
        <Button onClick={() => handleConstant("pi")} className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}>
          π
        </Button>
        <Button onClick={() => handleConstant("e")} className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}>
          e
        </Button>
        <Button onClick={handleBackspace} className={`${buttonClass} bg-orange-500 hover:bg-orange-600`}>
          ⌫
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
        <Button onClick={() => handleOperator("/")} className={`${buttonClass} bg-blue-500 hover:bg-blue-600`}>
          ÷
        </Button>
        <Button onClick={() => setExpression(expression + "(")} className={`${buttonClass} bg-gray-500 hover:bg-gray-600`}>
          (
        </Button>
        <Button onClick={() => setExpression(expression + ")")} className={`${buttonClass} bg-gray-500 hover:bg-gray-600`}>
          )
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
        <Button onClick={() => handleOperator("*")} className={`${buttonClass} bg-blue-500 hover:bg-blue-600`}>
          ×
        </Button>
        <Button onClick={() => handleFunction("factorial")} className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}>
          x!
        </Button>
        <Button onClick={() => handleFunction("reciprocal")} className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}>
          1/x
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
        <Button onClick={() => handleOperator("-")} className={`${buttonClass} bg-blue-500 hover:bg-blue-600`}>
          −
        </Button>
        <Button onClick={() => handleFunction("abs")} className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}>
          |x|
        </Button>
        <Button onClick={() => handleFunction("percent")} className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}>
          %
        </Button>

        <Button onClick={() => handleNumber("0")} className={`${buttonClass} bg-gray-600 hover:bg-gray-700 col-span-2`}>
          0
        </Button>
        <Button onClick={handleDecimal} className={`${buttonClass} bg-gray-600 hover:bg-gray-700`}>
          .
        </Button>
        <Button onClick={() => handleOperator("+")} className={`${buttonClass} bg-blue-500 hover:bg-blue-600`}>
          +
        </Button>
        <Button onClick={handleEquals} className={`${buttonClass} bg-green-500 hover:bg-green-600 col-span-2`}>
          =
        </Button>
      </div>
    </div>
  );
}
