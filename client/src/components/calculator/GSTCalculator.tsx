import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { type CalculationHistory } from "@shared/schema";

interface GSTCalculatorProps {
  onCalculation: (calculation: Omit<CalculationHistory, "id" | "timestamp">) => void;
}

export default function GSTCalculator({ onCalculation }: GSTCalculatorProps) {
  const [calculationType, setCalculationType] = useState<"exclusive" | "inclusive">("exclusive");
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState("18");
  const [originalAmount, setOriginalAmount] = useState<number | null>(null);
  const [gstAmount, setGstAmount] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);

  const calculateGST = () => {
    if (!amount) return;

    const inputAmount = parseFloat(amount);
    const rate = parseFloat(gstRate);
    
    let original: number;
    let gst: number;
    let total: number;

    if (calculationType === "exclusive") {
      // Add GST to amount
      original = inputAmount;
      gst = (inputAmount * rate) / 100;
      total = inputAmount + gst;
    } else {
      // Remove GST from amount
      total = inputAmount;
      original = inputAmount / (1 + rate / 100);
      gst = inputAmount - original;
    }

    setOriginalAmount(original);
    setGstAmount(gst);
    setTotalAmount(total);

    const action = calculationType === "exclusive" ? "+" : "-";
    onCalculation({
      type: "gst",
      expression: `₹${inputAmount} ${action} ${rate}% GST`,
      result: `₹${total.toFixed(2)}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          Calculation Type
        </Label>
        <div className="flex gap-2">
          <Button
            variant={calculationType === "exclusive" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setCalculationType("exclusive")}
          >
            Add GST
          </Button>
          <Button
            variant={calculationType === "inclusive" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setCalculationType("inclusive")}
          >
            Remove GST
          </Button>
        </div>
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-2">Amount</Label>
        <Input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-2">GST Rate (%)</Label>
        <Select value={gstRate} onValueChange={setGstRate}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0% - Exempt</SelectItem>
            <SelectItem value="5">5% - Essential items</SelectItem>
            <SelectItem value="12">12% - Standard rate</SelectItem>
            <SelectItem value="18">18% - Most goods</SelectItem>
            <SelectItem value="28">28% - Luxury items</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={calculateGST} className="w-full bg-primary hover:bg-blue-700">
        Calculate GST
      </Button>

      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-800 mb-4">GST Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Original Amount:</span>
              <span className="font-semibold">
                ₹{originalAmount ? originalAmount.toFixed(2) : "0.00"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">GST Amount:</span>
              <span className="font-semibold text-blue-600">
                ₹{gstAmount ? gstAmount.toFixed(2) : "0.00"}
              </span>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between">
              <span className="text-gray-800 font-semibold">Total Amount:</span>
              <span className="font-bold text-lg">
                ₹{totalAmount ? totalAmount.toFixed(2) : "0.00"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
