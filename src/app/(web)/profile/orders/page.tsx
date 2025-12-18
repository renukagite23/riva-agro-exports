
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Order } from '@/lib/types';
import { ShoppingBag, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderDetailsModal } from '@/components/order-details-modal';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace('/login?redirect=/profile/orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/orders/user/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  if (!user) {
    return null;
  }
  
  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return 'default';
      case 'Shipped': return 'secondary';
      case 'Processing': return 'outline';
      case 'Pending': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'destructive';
    }
  };
  
  if (isLoading) {
    return (
        <div className="container py-12">
            <h1 className="font-headline text-4xl font-bold tracking-tight mb-8">My Orders</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Order History</CardTitle>
                    <CardDescription>View the status and details of your past orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <>
      <div className="container py-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight mb-8">My Orders</h1>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Order History</CardTitle>
            <CardDescription>View the status and details of your past orders.</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id.slice(-6).toUpperCase()}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Order</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
               <div className="text-center py-16">
                  <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
                  <h2 className="mt-6 text-2xl font-semibold">No Orders Yet</h2>
                  <p className="mt-2 text-muted-foreground">You haven't placed any orders with us.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
      {selectedOrder && (
        <OrderDetailsModal 
            order={selectedOrder} 
            isOpen={!!selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
        />
      )}
    </>
  );
}
