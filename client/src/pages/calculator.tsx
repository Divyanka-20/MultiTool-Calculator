import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, SquareRadical, Weight, ArrowLeftRight, DollarSign, Percent } from "lucide-react";
import BasicCalculator from "@/components/calculator/BasicCalculator";
import ScientificCalculator from "@/components/calculator/ScientificCalculator";
import BMICalculator from "@/components/calculator/BMICalculator";
import UnitConverter from "@/components/calculator/UnitConverter";
import CurrencyConverter from "@/components/calculator/CurrencyConverter";
import GSTCalculator from "@/components/calculator/GSTCalculator";
import HistoryPanel from "@/components/calculator/HistoryPanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { type CalculationHistory } from "@shared/schema";

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [history, setHistory] = useLocalStorage<CalculationHistory[]>("calculator-history", []);

  const addToHistory = (calculation: Omit<CalculationHistory, "id" | "timestamp">) => {
    const newEntry: CalculationHistory = {
      ...calculation,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    const updatedHistory = [newEntry, ...history].slice(0, 10);
    setHistory(updatedHistory);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Multi-Function Calculator</h1>
          <p className="text-gray-600">Complete calculation suite for all your needs</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6 bg-primary text-white rounded-none">
                  <TabsTrigger value="basic" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <Calculator className="w-4 h-4 mr-2" />
                    Basic
                  </TabsTrigger>
                  <TabsTrigger value="scientific" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <SquareRadical className="w-4 h-4 mr-2" />
                    Scientific
                  </TabsTrigger>
                  <TabsTrigger value="bmi" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <Weight className="w-4 h-4 mr-2" />
                    BMI
                  </TabsTrigger>
                  <TabsTrigger value="unit" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                    Unit
                  </TabsTrigger>
                  <TabsTrigger value="currency" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Currency
                  </TabsTrigger>
                  <TabsTrigger value="gst" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <Percent className="w-4 h-4 mr-2" />
                    GST
                  </TabsTrigger>
                </TabsList>

                <div className="p-6">
                  <TabsContent value="basic" className="m-0">
                    <BasicCalculator onCalculation={addToHistory} />
                  </TabsContent>
                  <TabsContent value="scientific" className="m-0">
                    <ScientificCalculator onCalculation={addToHistory} />
                  </TabsContent>
                  <TabsContent value="bmi" className="m-0">
                    <BMICalculator onCalculation={addToHistory} />
                  </TabsContent>
                  <TabsContent value="unit" className="m-0">
                    <UnitConverter onCalculation={addToHistory} />
                  </TabsContent>
                  <TabsContent value="currency" className="m-0">
                    <CurrencyConverter onCalculation={addToHistory} />
                  </TabsContent>
                  <TabsContent value="gst" className="m-0">
                    <GSTCalculator onCalculation={addToHistory} />
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <HistoryPanel history={history} onClearHistory={clearHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}
