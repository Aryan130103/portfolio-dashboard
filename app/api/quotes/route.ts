import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import { stocks, yahooSymbol } from "@/lib/stocks";
import { Stock } from "@/lib/types";
import { getCached } from "@/lib/cache";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export const dynamic = "force-dynamic";

// price of one stock, null if yahoo has nothing for it
// (asking one by one because for BSE number codes yahoo sends back a different symbol name,
// so matching a big list by symbol did not work)
async function getPrice(s: Stock): Promise<number | null> {
  try {
    const q: any = await yahooFinance.quote(yahooSymbol(s), {}, { validateResult: false });
    return q?.regularMarketPrice ?? null;
  } catch (err) {
    console.log("price failed for " + s.name);
    return null;
  }
}

// gives CMP of all stocks, 10 stocks at a time so yahoo does not block us
// result is saved for 10 sec
export async function GET() {
  try {
    const prices = await getCached("quotes", 10, async () => {
      const out: Record<number, number | null> = {};

      for (let i = 0; i < stocks.length; i += 10) {
        const batch = stocks.slice(i, i + 10);
        const list = await Promise.all(batch.map(getPrice));
        batch.forEach((s, j) => {
          out[s.id] = list[j];
        });
      }

      // nothing came at all, so yahoo is probably blocking. throw so the old saved prices are used
      if (Object.values(out).every((p) => p === null)) {
        throw new Error("no prices received");
      }
      return out;
    });

    const failed = stocks.filter((s) => prices[s.id] === null).map((s) => s.id);
    return NextResponse.json({ prices, failed });
  } catch (err) {
    console.log("quotes error", err);
    return NextResponse.json({ error: "Could not get prices from Yahoo Finance." }, { status: 500 });
  }
}
