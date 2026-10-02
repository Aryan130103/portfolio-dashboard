import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import { stocks, googleSymbol, yahooSymbol } from "@/lib/stocks";
import { getGoogleData } from "@/lib/google";
import { getCached } from "@/lib/cache";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// gives P/E and EPS of all stocks
// google first, if google fails then yahoo. saved for 5 min per stock
export async function GET() {
  const pes: Record<number, number | null> = {};
  const epss: Record<number, number | null> = {};
  const failed: number[] = [];

  // 5 stocks at a time, otherwise 26 requests together may get blocked
  for (let i = 0; i < stocks.length; i += 5) {
    const batch = stocks.slice(i, i + 5);

    await Promise.all(
      batch.map(async (s) => {
        let result: { pe: number | null; eps: number | null } = { pe: null, eps: null };

        try {
          result = await getCached("fund-" + s.id, 300, async () => {
            let pe: number | null = null;
            let eps: number | null = null;

            try {
              const g = await getGoogleData(googleSymbol(s));
              pe = g.pe;
              eps = g.eps;
            } catch (err) {
              console.log("google failed for " + s.name);
            }

            // google did not give everything, so ask yahoo for the missing ones
            if (pe === null || eps === null) {
              try {
                const y: any = await yahooFinance.quote(yahooSymbol(s), {}, { validateResult: false });
                if (pe === null) pe = y?.trailingPE ?? null;
                if (eps === null) eps = y?.epsTrailingTwelveMonths ?? null;
              } catch (err) {
                console.log("yahoo failed for " + s.name);
              }
            }

            return { pe, eps };
          });
        } catch (err) {
          console.log("fundamentals failed for " + s.name);
        }

        pes[s.id] = result.pe;
        epss[s.id] = result.eps;
        if (result.pe === null && result.eps === null) failed.push(s.id);
      })
    );
  }

  return NextResponse.json({ pes, epss, failed });
}
