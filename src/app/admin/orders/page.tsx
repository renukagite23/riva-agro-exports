'use client';

import * as React from 'react';
import { ListFilter, MoreHorizontal, Search, File, Calendar as CalendarIcon, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { OrderDetailsModal } from '@/components/admin/order-details-modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { addDays, format, isAfter, isBefore, parseISO } from 'date-fns';
import type { Order } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return 'default';
      case 'Shipped': return 'secondary';
      case 'Processing': return 'outline';
      case 'Pending': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [search, setSearch] = React.useState('');
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [paymentStatusFilter, setPaymentStatusFilter] = React.useState<string[]>([]);
  const [paymentMethodFilter, setPaymentMethodFilter] = React.useState<string[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch orders.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [toast]);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    const originalOrders = [...orders];
    // Optimistic update
    setOrders(prevOrders => 
        prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        )
    );
    try {
        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) {
            throw new Error('Failed to update status');
        }
        toast({ title: '✅ Success', description: 'Order status updated.'});
    } catch (error) {
        setOrders(originalOrders); // Revert on error
        toast({ variant: 'destructive', title: 'Error', description: 'Could not update order status.' });
    }
  };

  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => {
        const orderDate = parseISO(order.createdAt);
        const dateMatch = (!date?.from || isAfter(orderDate, date.from)) && (!date?.to || isBefore(orderDate, addDays(date.to, 0)));
        const searchMatch = order.id.toLowerCase().includes(search.toLowerCase()) || order.shippingAddress.name.toLowerCase().includes(search.toLowerCase());
        const statusMatch = statusFilter.length === 0 || statusFilter.includes(order.status);
        const paymentStatusMatch = paymentStatusFilter.length === 0 || paymentStatusFilter.includes(order.paymentStatus);
        const paymentMethodMatch = paymentMethodFilter.length === 0 || paymentMethodFilter.includes(order.paymentMethod);
        
        return dateMatch && searchMatch && statusMatch && paymentStatusMatch && paymentMethodMatch;
    });
  }, [orders, search, date, statusFilter, paymentStatusFilter, paymentMethodFilter]);

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
      setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  }

  const exportToCsv = () => {
    const headers = ['Order ID', 'Customer', 'Date', 'Status', 'Total', 'Payment Method', 'Payment Status'];
    const rows = filteredOrders.map(order => [
        order.id,
        order.shippingAddress.name,
        format(new Date(order.createdAt), "dd MMM, yyyy"),
        order.status,
        order.total.toFixed(2),
        order.paymentMethod,
        order.paymentStatus
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>View and manage all customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="relative flex-1 md:grow-0">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search orders..." className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className="w-[260px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Filter by date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked={statusFilter.includes('Pending')} onCheckedChange={() => handleFilterChange(setStatusFilter, 'Pending')}>Pending</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={statusFilter.includes('Processing')} onCheckedChange={() => handleFilterChange(setStatusFilter, 'Processing')}>Processing</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={statusFilter.includes('Shipped')} onCheckedChange={() => handleFilterChange(setStatusFilter, 'Shipped')}>Shipped</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={statusFilter.includes('Delivered')} onCheckedChange={() => handleFilterChange(setStatusFilter, 'Delivered')}>Delivered</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={statusFilter.includes('Cancelled')} onCheckedChange={() => handleFilterChange(setStatusFilter, 'Cancelled')}>Cancelled</DropdownMenuCheckboxItem>
                   <DropdownMenuSeparator />
                   <DropdownMenuLabel>Payment Status</DropdownMenuLabel>
                   <DropdownMenuCheckboxItem checked={paymentStatusFilter.includes('Paid')} onCheckedChange={() => handleFilterChange(setPaymentStatusFilter, 'Paid')}>Paid</DropdownMenuCheckboxItem>
                   <DropdownMenuCheckboxItem checked={paymentStatusFilter.includes('Pending')} onCheckedChange={() => handleFilterChange(setPaymentStatusFilter, 'Pending')}>Pending</DropdownMenuCheckboxItem>
                   <DropdownMenuCheckboxItem checked={paymentStatusFilter.includes('Failed')} onCheckedChange={() => handleFilterChange(setPaymentStatusFilter, 'Failed')}>Failed</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-10 gap-1" onClick={exportToCsv}>
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center">Loading...</TableCell></TableRow>
              ) : filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell>{order.shippingAddress.name}</TableCell>
                  <TableCell>{format(new Date(order.createdAt), "dd MMM, yyyy")}</TableCell>
                  <TableCell>
                    {order.status === 'Delivered' || order.status === 'Cancelled' ? (
                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    ) : (
                        <Select value={order.status} onValueChange={(value: Order['status']) => handleStatusChange(order.id, value)}>
                            <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Processing">Processing</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                     <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
