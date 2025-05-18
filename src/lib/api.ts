"use server"

import { format } from "date-fns"
import type { ChartData, FormData } from "./types"

export async function fetchOptionsData(formData: FormData): Promise<{
  optionsData: ChartData
  underlyingData: ChartData
}> {
  const { ticker, strikePrice, startDate, expirationDate, optionType } = formData

  // Format dates for API
  const fromDate = format(startDate, "yyyy-MM-dd")
  const toDate = format(expirationDate, "yyyy-MM-dd")

  // Create the options symbol in OCC format (e.g., AAPL230616C00150000)
  // Format: Symbol + YY + MM + DD + C/P + Strike padded to 8 digits with leading zeros
  const year = format(expirationDate, "yy")
  const month = format(expirationDate, "MM")
  const day = format(expirationDate, "dd")
  const optionTypeChar = optionType === "call" ? "C" : "P"

  // Format strike price (multiply by 1000 and pad with leading zeros to 8 digits)
  const strikePadded = (Number.parseFloat(strikePrice) * 1000).toFixed(0).padStart(8, "0")

  const optionSymbol = `O:${ticker}${year}${month}${day}${optionTypeChar}${strikePadded}`

  // Fetch options data
  const optionsResponse = await fetchAggregates(optionSymbol, fromDate, toDate)

  // Fetch underlying stock data for the same period
  const underlyingResponse = await fetchAggregates(ticker, fromDate, toDate)

  return {
    optionsData: formatAggregateData(optionsResponse),
    underlyingData: formatAggregateData(underlyingResponse),
  }
}

async function fetchAggregates(ticker: string, fromDate: string, toDate: string) {
  const apiKey = import.meta.env.VITE_POLYGON_API_KEY

  if (!apiKey) {
    throw new Error("Polygon API key is not configured")
  }

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${fromDate}/${toDate}?apiKey=${apiKey}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data.resultsCount === 0 || !data.results) {
      return []
    }

    return data.results
  } catch (error) {
    console.error("Error fetching data from Polygon API:", error)
    throw new Error("Failed to fetch data from Polygon API")
  }
}

function formatAggregateData(results: any[]): ChartData {
  if (!results || results.length === 0) {
    return []
  }

  return results.map((item) => ({
    date: new Date(item.t).toISOString().split("T")[0],
    open: item.o,
    high: item.h,
    low: item.l,
    close: item.c,
    volume: item.v,
  }))
}
