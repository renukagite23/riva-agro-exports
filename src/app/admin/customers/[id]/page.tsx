
'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ChevronLeft } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { User, Order } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function CustomerDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const { toast } = useToast();

    const [customer, setCustomer] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        async function fetchCustomerData() {
            setIsLoading(true);
            try {
                const [customerRes, ordersRes] = await Promise.all([
                    fetch(`/api/users/${id}`),
                    fetch(`/api/orders/user/${id}`)
                ]);

                if (customerRes.status === 404) {
                    notFound();
                    return;
                }
                if (!customerRes.ok || !ordersRes.ok) {
                    throw new Error('Failed to fetch customer data');
                }

                const customerData = await customerRes.json();
                const ordersData = await ordersRes.json();

                setCustomer(customerData);
                setOrders(ordersData);

            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to load customer details.'
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchCustomerData();

    }, [id, toast]);

    if (isLoading) {
        return (
            <div>
                 <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <Skeleton className="h-6 w-48" />
                </div>
                <div className="space-y-8">
                     <Card><CardHeader><Skeleton className="h-6 w-40" /></CardHeader><CardContent><Skeleton className="h-16 w-full" /></CardContent></Card>
                     <Card><CardHeader><Skeleton className="h-6 w-40" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
                </div>
            </div>
        )
    }

    if (!customer) {
        return notFound();
    }

    return (
        <div>
             <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                    <Link href="/admin/customers">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                   Customer: {customer.name}
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-3">
                     <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Name</p>
                            <p>{customer.name}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Email</p>
                            <p>{customer.email}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Role</p>
                            <div><Badge variant={customer.role === 'Admin' ? 'destructive' : 'secondary'}>{customer.role}</Badge></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle>Order History</CardTitle>
                        <CardDescription>A list of orders placed by this customer.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.length > 0 ? (
                                    orders.map(order => (
                                        <TableRow key={order.id}>
                                            <TableCell>#{order.id.slice(-6).toUpperCase()}</TableCell>
                                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell><Badge>{order.status}</Badge></TableCell>
                                            <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24">This customer has not placed any orders yet.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
