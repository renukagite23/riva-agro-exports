'use client';

import * as React from 'react';
import {
  ListFilter,
  Search,
  File,
  Eye,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { Order } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { addDays, format, isAfter, isBefore, parseISO } from 'date-fns';

/* ================= HELPERS ================= */

const ITEMS_PER_PAGE = 5;

const getStatusVariant = (status: Order['status']) => {
  switch (status) {
    case 'Delivered':
      return 'default';
    case 'Shipped':
      return 'secondary';
    case 'Cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
};

/* ================= PAGE ================= */

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);

  const [currentPage, setCurrentPage] = React.useState(1);

  const { toast } = useToast();

  /* ================= FETCH ================= */

  React.useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error();
        const data = await response.json();
        setOrders(data);
        setCurrentPage(1);
      } catch {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch orders.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  /* ================= STATUS UPDATE ================= */

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order['status']
  ) => {
    const originalOrders = [...orders];

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error();

      toast({
        title: '✅ Success',
        description: 'Order status updated.',
      });
    } catch {
      setOrders(originalOrders);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not update order status.',
      });
    }
  };

  /* ================= FILTER ================= */

  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      const searchMatch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.shippingAddress.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const statusMatch =
        statusFilter.length === 0 ||
        statusFilter.includes(order.status);

      return searchMatch && statusMatch;
    });
  }, [orders, search, statusFilter]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(
    filteredOrders.length / ITEMS_PER_PAGE
  );

  const paginatedOrders = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredOrders, currentPage]);

  /* ================= EXPORT ================= */

  const exportToCsv = () => {
    const headers = [
      'Order ID',
      'Customer',
      'Date',
      'Status',
      'Total',
    ];

    const rows = filteredOrders.map((o) =>
      [
        o.id,
        o.shippingAddress.name,
        format(new Date(o.createdAt), 'dd MMM yyyy'),
        o.status,
        o.total.toFixed(2),
      ].join(',')
    );

    const csv =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows].join('\n');

    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = 'orders.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ================= UI ================= */

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Orders
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            View and manage all customer orders.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* FILTER BAR */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8 md:w-[240px]"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ListFilter className="h-4 w-4 mr-1" /> Status
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuSeparator />
                  {[
                    'Pending',
                    'Processing',
                    'Shipped',
                    'Delivered',
                    'Cancelled',
                  ].map((s) => (
                    <DropdownMenuCheckboxItem
                      key={s}
                      checked={statusFilter.includes(s)}
                      onCheckedChange={() =>
                        setStatusFilter((prev) =>
                          prev.includes(s)
                            ? prev.filter((v) => v !== s)
                            : [...prev, s]
                        )
                      }
                    >
                      {s}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={exportToCsv}
              >
                <File className="h-4 w-4 mr-1" /> Export Data
              </Button>
            </div>
          </div>

          {/* TABLE */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  Total
                </TableHead>
                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      {order.shippingAddress.name}
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(order.createdAt),
                        'dd MMM yyyy'
                      )}
                    </TableCell>
                    <TableCell>
                      {order.status === 'Delivered' ||
                      order.status === 'Cancelled' ? (
                        <Badge
                          variant={getStatusVariant(order.status)}
                        >
                          {order.status}
                        </Badge>
                      ) : (
                        <Select
                          value={order.status}
                          onValueChange={(v) =>
                            handleStatusChange(
                              order.id,
                              v as Order['status']
                            )
                          }
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">
                              Pending
                            </SelectItem>
                            <SelectItem value="Processing">
                              Processing
                            </SelectItem>
                            <SelectItem value="Shipped">
                              Shipped
                            </SelectItem>
                            <SelectItem value="Delivered">
                              Delivered
                            </SelectItem>
                            <SelectItem value="Cancelled">
                              Cancelled
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{order.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          (window.location.href =
                            `/admin/orders/edit/${order.id}?readOnly=true`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* PAGINATION */}
          {filteredOrders.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((p) => p - 1)
                  }
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => p + 1)
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
