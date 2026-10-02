import data from "@/data/portfolio.json";
import { Stock } from "./types";

export const stocks = data as Stock[];

// yahoo needs .NS or .BO at the end
// some BSE stocks have a "yahoo" ticker in portfolio.json because the number code gave no price
export function yahooSymbol(s: Stock) {
  if (s.yahoo) return s.yahoo;
  return s.exchange === "NSE" ? s.code + ".NS" : s.code + ".BO";
}

// google needs :NSE or :BOM
export function googleSymbol(s: Stock) {
  return s.exchange === "NSE" ? s.code + ":NSE" : s.code + ":BOM";
}
