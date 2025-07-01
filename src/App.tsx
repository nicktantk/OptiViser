import OptionsForm from "@/components/OptionsForm";
import Header from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OptionsChart from "./components/OptionsChart";
import { fetchOptionsData } from "@/lib/api";
import { useState } from "react";
import type { ChartData, FormData } from "./lib/types";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optionsData, setOptionsData] = useState<ChartData | null>(null);
  const [underlyingData, setUnderlyingData] = useState<ChartData | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  async function handleFormSubmit(data: FormData) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchOptionsData(data);

      if (!result.optionsData || result.optionsData.length === 0) {
        setError(
          "No data found for the selected option. There might be no volume for this strike price."
        );
      } else {
        setOptionsData(result.optionsData);
        setUnderlyingData(result.underlyingData);
        setFormData(data);
        console.log(JSON.stringify(result));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch options data"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-2 text-center">
          Historical Options Data Viewer
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Visualise options and underlying asset data using Polygon.io API
        </p>
        <Card className="max-w-4xl mx-auto shadow-lg px-4 py-6">
          <CardHeader>
            <CardTitle className="text-xl">Options Data Form</CardTitle>
            <CardDescription>
              Enter the details below to view historical options data and
              underlying asset charts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OptionsForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
      {error && (
        <Alert variant="destructive" className="max-w-4xl mx-auto mb-8">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {optionsData && underlyingData && formData && (
        <div className="max-w-5xl mx-auto">
          <OptionsChart
            optionsData={optionsData}
            underlyingData={underlyingData}
            formData={formData}
          />
        </div>
      )}

      <footer className="border-t py-4 mt-6">
        <div className="container mx-auto text-center text-sm text-gray-500">
          Designed by Nicholas | {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
