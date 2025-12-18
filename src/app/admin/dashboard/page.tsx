
import { getOrders } from '@/lib/models/Order';
import { getUsers } from '@/lib/models/User';
import { format } from 'date-fns';
import { DashboardClient } from '@/components/admin/dashboard-client';

async function getDashboardData() {
    try {
        const [orders, users] = await Promise.all([
            getOrders(),
            getUsers()
        ]);

        const totalRevenue = orders
            .filter(order => order.status === 'Delivered')
            .reduce((sum, order) => sum + order.total, 0);

        const totalOrders = orders.length;
        const totalDeliveredOrders = orders.filter(order => order.status === 'Delivered').length;

        const totalCustomers = users.filter(user => user.role === 'User').length;
        
        const salesData = orders.reduce((acc, order) => {
          const date = format(new Date(order.createdAt), 'yyyy-MM-dd');
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += order.total;
          return acc;
        }, {} as Record<string, number>);

        const chartData = Object.entries(salesData).map(([date, total]) => ({
            name: format(new Date(date), 'MMM d'),
            total: total,
        })).slice(-7);


        const recentOrders = orders.slice(0, 5).map(o => ({...o, id: o.id.toString(), _id: o._id?.toString()}));

        return {
            totalRevenue,
            totalOrders,
            totalDeliveredOrders,
            totalCustomers,
            chartData,
            recentOrders,
        };
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Fallback to zeros in case of DB error
        return {
            totalRevenue: 0,
            totalOrders: 0,
            totalDeliveredOrders: 0,
            totalCustomers: 0,
            chartData: [],
            recentOrders: [],
        };
    }
}


export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <DashboardClient data={data} />
  );
}
