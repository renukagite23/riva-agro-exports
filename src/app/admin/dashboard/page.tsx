"use client";

import { useEffect, useState } from "react";
import {
  Wallet,
  ShoppingCart,
  Users,
  Activity,
  CheckCircle,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardCharts } from "@/components/dashboard/charts";

/* ================= GRADIENT KPI CARD ================= */
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  gradient: string;
}) {
  return (
    <div
      className={`
        relative
        rounded-lg
        px-4 py-4
        text-white
        shadow-sm
        ${gradient}
        min-h-[120px]
      `}
    >
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute bottom-0 right-10 h-16 w-16 rounded-full bg-white/10" />

      <div className="relative z-10 flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-xs opacity-80">{subtitle}</p>
        </div>

        <div className="h-9 w-9 rounded-md bg-white/20 flex items-center justify-center">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

/* ================= DASHBOARD PAGE ================= */
export default function AdminDashboardPage() {
  const [range, setRange] = useState("today");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/dashboard/stats?range=${range}`)
      .then((res) => res.json())
      .then(setData);
  }, [range]);

  if (!data) {
    return <p className="text-muted-foreground">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Business performance overview
          </p>
        </div>

        {/* <div className="flex gap-2">
          <Button
            size="sm"
            variant={range === "today" ? "default" : "outline"}
            onClick={() => setRange("today")}
          >
            Today
          </Button>
          <Button
            size="sm"
            variant={range === "month" ? "default" : "outline"}
            onClick={() => setRange("month")}
          >
            This Month
          </Button>
        </div> */}
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-[repeat(3,minmax(220px,260px))]  gap-8">
        <StatCard
          title="Total Revenue"
          value={`₹${data.totalRevenue}`}
          subtitle={`Today Revenue: ₹${data.todayRevenue}`}
          icon={Wallet}
          gradient="bg-gradient-to-r from-pink-400 to-orange-400"
        />

        <StatCard
          title="Total Orders"
          value={data.totalOrders}
          subtitle={`Today Orders: ${data.todayOrders}`}
          icon={ShoppingCart}
          gradient="bg-gradient-to-r from-blue-400 to-blue-600"
        />

        <StatCard
          title="Avg Order Value"
          value={`₹${data.averageOrderValue}`}
          subtitle="Today’s Orders"
          icon={Calculator}
          gradient="bg-gradient-to-r from-indigo-400 to-purple-500"
        />

        <StatCard
          title="Total Clients"
          value={data.totalClients}
          subtitle={`Total Vendors: ${data.totalVendors}`}
          icon={Users}
          gradient="bg-gradient-to-r from-cyan-400 to-teal-500"
        />

        <StatCard
          title="Ongoing Orders"
          value={data.ongoingOrders}
          subtitle={`Upcoming Orders: ${data.upcomingOrders}`}
          icon={Activity}
          gradient="bg-gradient-to-r from-emerald-400 to-green-500"
        />

        <StatCard
          title="Completed Orders"
          value={data.completedOrders}
          subtitle={`Cancelled Orders: ${data.cancelledOrders}`}
          icon={CheckCircle}
          gradient="bg-gradient-to-r from-rose-400 to-pink-500"
        />
      </div>

      {/* CHARTS */}
      <DashboardCharts />
    </div>
  );
}
