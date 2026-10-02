"use client";

import { memo } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { color, inr, num } from "@/lib/calc";
import { Row, Sector } from "@/lib/types";

// columns are outside so they are not created again on every render
const columns: ColumnDef<Row>[] = [
  { header: "Particulars", accessorKey: "name" },
  { header: "Purchase Price", accessorKey: "purchasePrice", cell: (c) => inr(c.getValue<number>()) },
  { header: "Qty", accessorKey: "qty" },
  { header: "Investment", accessorKey: "investment", cell: (c) => inr(c.getValue<number>()) },
  { header: "Portfolio (%)", accessorKey: "portfolioPct", cell: (c) => c.getValue<number>().toFixed(2) + "%" },
  { header: "NSE/BSE", id: "exchange", accessorFn: (r) => r.exchange + ": " + r.code },
  { header: "CMP", accessorKey: "cmp", cell: (c) => inr(c.getValue<number | null>()) },
  { header: "Present Value", accessorKey: "presentValue", cell: (c) => inr(c.getValue<number | null>()) },
  {
    header: "Gain/Loss",
    accessorKey: "gainLoss",
    cell: (c) => {
      const v = c.getValue<number | null>();
      return <span className={color(v)}>{inr(v)}</span>;
    },
  },
  { header: "P/E Ratio", accessorKey: "pe", cell: (c) => num(c.getValue<number | null>()) },
  { header: "Latest Earnings (EPS)", accessorKey: "eps", cell: (c) => num(c.getValue<number | null>()) },
];

function SectorTable({ sector }: { sector: Sector }) {
  const table = useReactTable({ data: sector.rows, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="rounded border bg-white">
      {/* sector summary */}
      <div className="flex flex-wrap justify-between gap-2 border-b bg-gray-50 p-3">
        <h2 className="text-lg font-semibold">{sector.name}</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <span>Investment: <b>{inr(sector.investment)}</b></span>
          <span>Present Value: <b>{inr(sector.presentValue)}</b></span>
          <span>
            Gain/Loss: <b className={color(sector.gainLoss)}>{inr(sector.gainLoss)}</b>
          </span>
        </div>
      </div>

      {/* table scrolls sideways on mobile */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="whitespace-nowrap p-2">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="whitespace-nowrap p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// memo = only re-render when this sector's data changes
export default memo(SectorTable);
