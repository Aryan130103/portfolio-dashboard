"use client";

import { memo } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { inr } from "@/lib/calc";
import { Sector } from "@/lib/types";

const colors = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2"];

function SectorChart({ sectors }: { sectors: Sector[] }) {
  const data = sectors.map((s) => ({ name: s.name, value: s.investment }));

  return (
    <div className="rounded border bg-white p-4">
      <h2 className="mb-2 text-lg font-semibold">Investment by Sector</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius="80%">
              {data.map((d, i) => (
                <Cell key={d.name} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => inr(v)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default memo(SectorChart);
