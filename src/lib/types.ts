import { z } from "zod"

export const formSchema = z.object({
  ticker: z.string().min(1, "Ticker is required").max(5),
  strikePrice: z.string().min(1, "Strike price is required"),
  startDate: z.string({
    required_error: "Current date is required",
  }),
  expirationDate: z.string({
    required_error: "Expiry date is required",
  }),
  optionType: z.enum(["call", "put"], {
    required_error: "Option type is required",
  }),
})

export type FormData = z.infer<typeof formSchema>

export type ChartDataPoint = {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type ChartData = ChartDataPoint[]
