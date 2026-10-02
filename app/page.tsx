"use client";

import { useEffect, useMemo, useState } from "react";
import ErrorBanner from "@/components/ErrorBanner";
import SectorChart from "@/components/SectorChart";
import SectorTable from "@/components/SectorTable";
import SummaryCards from "@/components/SummaryCards";
import { makeRows, makeSectors } from "@/lib/calc";
import { stocks } from "@/lib/stocks";

export default function Home() {
  const [prices, setPrices] = useState<Record<string, number | null>>({});
  const [pes, setPes] = useState<Record<string, number | null>>({});
  const [epss, setEpss] = useState<Record<string, number | null>>({});
  const [error, setError] = useState("");
  const [fundError, setFundError] = useState("");
  const [failedPrices, setFailedPrices] = useState(0);
  const [failedFund, setFailedFund] = useState(0);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState("");

  async function getPrices() {
    try {
      const res = await fetch("/api/quotes");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPrices(data.prices);
      setFailedPrices(data.failed.length);
      setTime(new Date().toLocaleTimeString("en-IN"));
      setError("");
    } catch (err) {
      setError("Could not update prices. Showing the old data.");
    }
    setLoading(false);
  }

  async function getFundamentals() {
    try {
      const res = await fetch("/api/fundamentals");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPes(data.pes);
      setEpss(data.epss);
      setFailedFund(data.failed.length);
      setFundError("");
    } catch (err) {
      setFundError("Could not load P/E and earnings. They may show N/A.");
    }
  }

  // prices: once on load, then every 15 sec
  useEffect(() => {
    getPrices();
    const timer = setInterval(getPrices, 15000);
    return () => clearInterval(timer);
  }, []);

  // P/E and EPS change slowly so every 5 min is enough
  useEffect(() => {
    getFundamentals();
    const timer = setInterval(getFundamentals, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // only calculate again when data changes
  const sectors = useMemo(() => makeSectors(makeRows(stocks, prices, pes, epss)), [prices, pes, epss]);

  const total = useMemo(() => {
    let investment = 0;
    let presentValue = 0;
    let gainLoss = 0;
    for (const s of sectors) {
      investment += s.investment;
      presentValue += s.presentValue;
      gainLoss += s.gainLoss;
    }
    return { investment, presentValue, gainLoss };
  }, [sectors]);

  return (
    <main className="mx-auto max-w-7xl space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Dashboard</h1>
          <p className="text-sm text-gray-500">
            {time ? "Last updated: " + time + " (refreshes every 15 seconds)" : "Loading..."}
          </p>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}
      {fundError && <ErrorBanner message={fundError} />}
      {failedPrices > 0 && <ErrorBanner message={"Could not get price for " + failedPrices + " stock(s). They show N/A."} />}
      {failedFund > 0 && <ErrorBanner message={"P/E and earnings not available for " + failedFund + " stock(s)."} />}

      {loading ? (
        <p className="text-center text-gray-500">Loading portfolio...</p>
      ) : (
        <>
          <SummaryCards {...total} />
          <SectorChart sectors={sectors} />
          {sectors.map((s) => (
            <SectorTable key={s.name} sector={s} />
          ))}
        </>
      )}

      <p className="pb-6 text-xs text-gray-500">
        Disclaimer: data is taken from Yahoo Finance and Google Finance without official APIs, so it can be
        delayed or wrong. Please do not use it for real trading.
      </p>
    </main>
  );
}
