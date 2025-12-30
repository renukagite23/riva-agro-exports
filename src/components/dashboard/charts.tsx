"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card } from "@/components/ui/card";

const demoData = [
  { name: "Mon", revenue: 12000, orders: 22 },
  { name: "Tue", revenue: 18000, orders: 30 },
  { name: "Wed", revenue: 15000, orders: 26 },
  { name: "Thu", revenue: 22000, orders: 34 },
  { name: "Fri", revenue: 28000, orders: 42 },
];

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Revenue Chart */}
      <Card className="p-4 rounded-xl shadow-sm">
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">
          Revenue Trend
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={demoData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8b5cf6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Orders Chart */}
      <Card className="p-4 rounded-xl shadow-sm">
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">
          Orders Trend
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={demoData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="orders"
              fill="#22c55e"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
