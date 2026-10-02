import { color, inr } from "@/lib/calc";

type Props = { investment: number; presentValue: number; gainLoss: number };

export default function SummaryCards({ investment, presentValue, gainLoss }: Props) {
  const percent = investment > 0 ? (gainLoss / investment) * 100 : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded border bg-white p-4">
        <p className="text-sm text-gray-500">Total Investment</p>
        <p className="text-xl font-semibold">{inr(investment)}</p>
      </div>
      <div className="rounded border bg-white p-4">
        <p className="text-sm text-gray-500">Present Value</p>
        <p className="text-xl font-semibold">{inr(presentValue)}</p>
      </div>
      <div className="rounded border bg-white p-4">
        <p className="text-sm text-gray-500">Total Gain/Loss</p>
        <p className={"text-xl font-semibold " + color(gainLoss)}>
          {inr(gainLoss)} ({percent.toFixed(2)}%)
        </p>
      </div>
    </div>
  );
}
