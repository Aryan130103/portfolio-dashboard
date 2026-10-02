import { Row, Sector, Stock } from "./types";

export function makeRows(
  stocks: Stock[],
  prices: Record<string, number | null>,
  pes: Record<string, number | null>,
  epss: Record<string, number | null>
): Row[] {
  let total = 0;
  for (const s of stocks) total += s.purchasePrice * s.qty;

  return stocks.map((s) => {
    const investment = s.purchasePrice * s.qty;
    const cmp = prices[s.id] ?? null;
    const presentValue = cmp === null ? null : cmp * s.qty;
    return {
      ...s,
      investment,
      portfolioPct: (investment / total) * 100,
      cmp,
      presentValue,
      gainLoss: presentValue === null ? null : presentValue - investment,
      pe: pes[s.id] ?? null,
      eps: epss[s.id] ?? null,
    };
  });
}

export function makeSectors(rows: Row[]): Sector[] {
  const sectors: Sector[] = [];

  for (const row of rows) {
    let sector = sectors.find((s) => s.name === row.sector);
    if (!sector) {
      sector = { name: row.sector, rows: [], investment: 0, presentValue: 0, gainLoss: 0 };
      sectors.push(sector);
    }
    sector.rows.push(row);
    sector.investment += row.investment;
    // skip stocks with no price so the gain/loss is not wrong
    if (row.presentValue !== null && row.gainLoss !== null) {
      sector.presentValue += row.presentValue;
      sector.gainLoss += row.gainLoss;
    }
  }
  return sectors;
}

export function inr(n: number | null) {
  if (n === null) return "N/A";
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR" });
}

export function num(n: number | null) {
  return n === null ? "N/A" : n.toFixed(2);
}

export function color(n: number | null) {
  if (n === null || n === 0) return "text-gray-500";
  return n > 0 ? "text-green-600" : "text-red-600";
}
