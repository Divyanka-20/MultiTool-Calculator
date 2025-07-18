import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Simple mock exchange rate endpoint for currency converter
  app.get("/api/exchange-rate/:from/:to", async (req, res) => {
    try {
      const { from, to } = req.params;
      
      if (from === to) {
        return res.json({ rate: 1.0, updatedAt: new Date() });
      }
      
      // Mock exchange rates for demonstration
      const mockRates: Record<string, Record<string, number>> = {
        "USD": { "EUR": 0.92, "GBP": 0.79, "JPY": 149.50, "INR": 83.25, "CNY": 7.24, "AUD": 1.52, "CAD": 1.35 },
        "EUR": { "USD": 1.09, "GBP": 0.86, "JPY": 162.50, "INR": 90.55, "CNY": 7.88, "AUD": 1.65, "CAD": 1.47 },
        "GBP": { "USD": 1.27, "EUR": 1.16, "JPY": 189.50, "INR": 105.75, "CNY": 9.20, "AUD": 1.93, "CAD": 1.71 },
        "JPY": { "USD": 0.0067, "EUR": 0.0061, "GBP": 0.0053, "INR": 0.56, "CNY": 0.048, "AUD": 0.010, "CAD": 0.009 },
        "INR": { "USD": 0.012, "EUR": 0.011, "GBP": 0.0095, "JPY": 1.79, "CNY": 0.087, "AUD": 0.018, "CAD": 0.016 },
        "CNY": { "USD": 0.138, "EUR": 0.127, "GBP": 0.109, "JPY": 20.65, "INR": 11.50, "AUD": 0.21, "CAD": 0.186 },
        "AUD": { "USD": 0.658, "EUR": 0.606, "GBP": 0.518, "JPY": 98.35, "INR": 54.75, "CNY": 4.76, "CAD": 0.888 },
        "CAD": { "USD": 0.741, "EUR": 0.681, "GBP": 0.584, "JPY": 110.75, "INR": 61.65, "CNY": 5.36, "AUD": 1.126 }
      };
      
      const rate = mockRates[from.toUpperCase()]?.[to.toUpperCase()];
      
      if (!rate) {
        return res.status(404).json({ message: "Exchange rate not found" });
      }
      
      res.json({
        rate: rate,
        updatedAt: new Date()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exchange rate" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
