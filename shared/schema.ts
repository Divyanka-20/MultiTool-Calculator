import { z } from "zod";

// Frontend-only types for localStorage storage
export const calculationHistorySchema = z.object({
  id: z.string(),
  type: z.enum(["basic", "scientific", "bmi", "unit", "currency", "gst"]),
  expression: z.string(),
  result: z.string(),
  timestamp: z.date(),
});

export const exchangeRateSchema = z.object({
  baseCurrency: z.string(),
  targetCurrency: z.string(),
  rate: z.number(),
  updatedAt: z.date(),
});

export type CalculationHistory = z.infer<typeof calculationHistorySchema>;
export type ExchangeRate = z.infer<typeof exchangeRateSchema>;
