"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/lib/types";
import { format } from "date-fns";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details: #{order.id.slice(-6).toUpperCase()}</DialogTitle>
          <DialogDescription>
            Date: {format(new Date(order.createdAt), "PPP")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
                <h3 className="font-semibold">Customer Details</h3>
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                <p>{order.shippingAddress.country}</p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">Payment Details</h3>
                <p>Method: {order.paymentMethod}</p>
                <div className="flex items-center gap-2">Status: <Badge variant={order.paymentStatus === 'Paid' ? 'default' : 'secondary'}>{order.paymentStatus}</Badge></div>
                {order.paymentId && <p className="text-xs text-muted-foreground">ID: {order.paymentId}</p>}
            </div>
             <div className="space-y-2">
                <h3 className="font-semibold">Status</h3>
                <p><Badge>{order.status}</Badge></p>
            </div>
        </div>
        <Separator />
        <div>
          <h3 className="font-semibold mb-2">Order Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map(item => (
                <TableRow key={item.variantId}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.variantName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Separator />
        <div className="flex justify-end items-center font-bold text-lg">
            <span>Total:</span>
            <span className="ml-4">₹{order.total.toFixed(2)}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
