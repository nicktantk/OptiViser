"use client";

import { format } from "date-fns";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartData, FormData } from "../lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ChartContainer } from "./ui/chart";

type OptionsChartsProps = {
  optionsData: ChartData;
  underlyingData: ChartData;
  formData: FormData;
};

export default function OptionsCharts({
  optionsData,
  underlyingData,
  formData,
}: OptionsChartsProps) {
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "MMM dd");
  };

  const formatTooltipDate = (dateStr: string) => {
    return format(new Date(dateStr), "MMM dd, yyyy");
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const CustomCandlestickTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-bold">{formatTooltipDate(data.date)}</p>
          <p>Open: {formatPrice(data.open)}</p>
          <p>High: {formatPrice(data.high)}</p>
          <p>Low: {formatPrice(data.low)}</p>
          <p>Close: {formatPrice(data.close)}</p>
          <p>Volume: {formatVolume(data.volume)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {formData.ticker} {formData.optionType.toUpperCase()} $
            {formData.strikePrice} (Expires:{" "}
            {format(formData.expirationDate, "MMM dd, yyyy")})
          </CardTitle>
          <CardDescription>
            Historical price data for the selected option
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              price: {
                label: "Price",
                color: "hsl(var(--chart-1))",
              },
              volume: {
                label: "Volume",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={optionsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                {/* Price Y-axis (left) */}
                <YAxis
                  yAxisId="left"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={formatPrice}
                  tick={{ fontSize: 12 }}
                />
                {/* Volume Y-axis (right) */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  dataKey="volume"
                  tickFormatter={formatVolume}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomCandlestickTooltip />} />
                <Legend />
                {/* Closing price as bars */}
                <Bar
                  dataKey="close"
                  fill="var(--color-price)"
                  opacity={0.3}
                  name="Closing Price"
                  yAxisId="left"
                />
                {/* Volume as area */}
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="var(--color-volume)"
                  fill="var(--color-volume)"
                  fillOpacity={0.1}
                  yAxisId="left"
                  name="Price"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{formData.ticker} Underlying Stock</CardTitle>
          <CardDescription>
            Historical price data for the underlying stock
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              price: {
                label: "Price",
                color: "hsl(var(--chart-1))",
              },
              volume: {
                label: "Volume",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={underlyingData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={formatPrice}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  dataKey="volume"
                  tickFormatter={formatVolume}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomCandlestickTooltip />} />
                <Legend />
                <Bar
                  dataKey="close"
                  yAxisId="left"
                  fill="var(--color-price)"
                  opacity={0.1}
                  name="Price"
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="var(--color-volume)"
                  fill="var(--color-volume)"
                  fillOpacity={0.1}
                  yAxisId="left"
                  name="Volume"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
