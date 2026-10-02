export type Stock = {
  id: number;
  name: string;
  sector: string;
  purchasePrice: number;
  qty: number;
  exchange: "NSE" | "BSE";
  code: string;
  yahoo?: string; // yahoo ticker, only for stocks where the number code does not work on yahoo
};

// stock + live data + calculated values
export type Row = Stock & {
  investment: number;
  portfolioPct: number;
  cmp: number | null;
  presentValue: number | null;
  gainLoss: number | null;
  pe: number | null;
  eps: number | null;
};

export type Sector = {
  name: string;
  rows: Row[];
  investment: number;
  presentValue: number;
  gainLoss: number;
};
