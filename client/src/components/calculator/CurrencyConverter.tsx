import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type CalculationHistory } from "@shared/schema";

interface CurrencyConverterProps {
  onCalculation: (calculation: Omit<CalculationHistory, "id" | "timestamp">) => void;
}

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "INR", name: "Indian Rupee" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
];

export default function CurrencyConverter({ onCalculation }: CurrencyConverterProps) {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState<string>("");

  const { data: exchangeRate, isLoading } = useQuery({
    queryKey: ["/api/exchange-rate", fromCurrency, toCurrency],
    enabled: fromCurrency !== toCurrency,
  });

  const convertCurrency = () => {
    if (!amount || !exchangeRate) return;

    const inputAmount = parseFloat(amount);
    const rate = parseFloat(exchangeRate.rate);
    const result = inputAmount * rate;
    
    setConvertedAmount(result.toFixed(2));

    onCalculation({
      type: "currency",
      expression: `${inputAmount} ${fromCurrency} to ${toCurrency}`,
      result: `${result.toFixed(2)} ${toCurrency}`,
    });
  };

  const getExchangeRateDisplay = () => {
    if (fromCurrency === toCurrency) {
      return `1 ${fromCurrency} = 1 ${toCurrency}`;
    }
    if (isLoading) {
      return "Loading...";
    }
    if (exchangeRate) {
      return `1 ${fromCurrency} = ${parseFloat(exchangeRate.rate).toFixed(4)} ${toCurrency}`;
    }
    return "Rate not available";
  };

  return (
    <div className="space-y-6">
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-3">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-sm text-green-700">
              Exchange rates updated: Just now
            </span>
          </div>
        </CardContent>
      </Card>

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
        <Label className="block text-sm font-medium text-gray-700 mb-2">From</Label>
        <Select value={fromCurrency} onValueChange={setFromCurrency}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-2">To</Label>
        <Select value={toCurrency} onValueChange={setToCurrency}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-gray-50">
        <CardContent className="pt-4">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Exchange Rate</div>
            <div className="text-lg font-semibold">
              {getExchangeRateDisplay()}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={convertCurrency} 
        className="w-full bg-primary hover:bg-blue-700"
        disabled={isLoading || !amount}
      >
        Convert Currency
      </Button>

      <Card className="bg-blue-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-800 mb-2">
              {convertedAmount || "--"}
            </div>
            <div className="text-sm text-gray-600">
              {convertedAmount ? `${toCurrency}` : "Enter amount to convert"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
