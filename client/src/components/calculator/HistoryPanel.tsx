import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, History } from "lucide-react";
import { type CalculationHistory } from "@shared/schema";

interface HistoryPanelProps {
  history: CalculationHistory[];
  onClearHistory: () => void;
}

export default function HistoryPanel({ history, onClearHistory }: HistoryPanelProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "basic":
        return "Basic Calculator";
      case "scientific":
        return "Scientific Calculator";
      case "bmi":
        return "BMI Calculator";
      case "unit":
        return "Unit Converter";
      case "currency":
        return "Currency Converter";
      case "gst":
        return "GST Calculator";
      default:
        return "Calculator";
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">History</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>

        <div className="space-y-2">
          {history.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <History className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No calculations yet</p>
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="bg-gray-50 p-3 rounded-lg text-sm">
                <div className="text-gray-600 break-words">{item.expression}</div>
                <div className="font-semibold text-gray-800 break-words">= {item.result}</div>
                <div className="text-xs text-gray-500">{getTypeLabel(item.type)}</div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
