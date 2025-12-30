import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalRevenueAgg,
    todayRevenueAgg,

    totalOrders,
    todayOrders,

    totalClients,
    totalVendors,

    ongoingOrders,
    upcomingOrders,

    completedOrders,
    cancelledOrders,
  ] = await Promise.all([
    // Revenue
    db.collection("orders").aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]).toArray(),

    db.collection("orders").aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]).toArray(),

    // Orders
    db.collection("orders").countDocuments(),
    db.collection("orders").countDocuments({ createdAt: { $gte: today } }),

    // Users
    db.collection("users").countDocuments({ role: "client" }),
    db.collection("users").countDocuments({ role: "vendor" }),

    // Order states
    db.collection("orders").countDocuments({ status: "ongoing" }),
    db.collection("orders").countDocuments({ status: "upcoming" }),

    db.collection("orders").countDocuments({ status: "completed" }),
    db.collection("orders").countDocuments({ status: "cancelled" }),
  ]);

  const totalRevenue = totalRevenueAgg[0]?.total || 0;
  const todayRevenue = todayRevenueAgg[0]?.total || 0;

  const averageOrderValue =
    todayOrders > 0 ? Math.round(todayRevenue / todayOrders) : 0;

  return NextResponse.json({
    totalRevenue,
    todayRevenue,

    totalOrders,
    todayOrders,

    averageOrderValue,

    totalClients,
    totalVendors,

    ongoingOrders,
    upcomingOrders,

    completedOrders,
    cancelledOrders,
  });
}
