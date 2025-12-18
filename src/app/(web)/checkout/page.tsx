

"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import type { CartItem, ShippingAddress, Order } from '@/lib/types';


const shippingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  zip: z.string().min(1, 'ZIP code is required'),
});

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      name: '', address: '', city: '', country: '', zip: '',
    },
  });

  useEffect(() => {
    if (!user) {
      router.replace('/login?redirect=/checkout');
    } else if (cartItems.length === 0) {
      router.replace('/cart');
    } else {
      setIsReady(true);
    }
  }, [user, cartItems, router]);
  
  
  const handlePayment = async (shippingDetails: ShippingAddress) => {
    setIsSubmitting(true);
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: cartTotal * 100, // amount in the smallest currency unit
      currency: "INR",
      name: "Riva Agro Exports",
      description: "Order Payment",
      handler: async function (response: any) {
        try {
          const orderData: Omit<Order, 'id' | '_id' | 'createdAt'> = {
            userId: user!.id,
            items: cartItems,
            total: cartTotal,
            status: 'Processing' as const,
            shippingAddress: shippingDetails,
            paymentMethod: 'Razorpay',
            paymentStatus: 'Paid' as const,
            paymentId: response.razorpay_payment_id,
          };

          const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
          });

          if (!res.ok) {
            throw new Error('Failed to save order');
          }
          
          clearCart();
          toast({
            title: '✅ Order Placed Successfully',
            description: 'Thank you for your purchase! Your order is being processed.',
          });
          router.push('/profile/orders');

        } catch (error) {
           toast({
            variant: 'destructive',
            title: 'Payment Error',
            description: 'Failed to process your order after payment. Please contact support.',
          });
        } finally {
            setIsSubmitting(false);
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: {
        color: "#166534"
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response: any){
            toast({
                variant: "destructive",
                title: "Payment Failed",
                description: response.error.description,
            });
            setIsSubmitting(false);
    });
    rzp.open();
  }

  function onSubmit(values: z.infer<typeof shippingSchema>) {
    handlePayment(values);
  }

  if (!isReady) {
    return null; // or a loading spinner
  }

  return (
    <div className="container py-12">
      <h1 className="font-headline text-4xl font-bold tracking-tight mb-8">Checkout</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField name="name" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="address" render={({ field }) => (
                  <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField name="country" render={({ field }) => (
                    <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField name="zip" render={({ field }) => (
                    <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">You will be redirected to Razorpay for a secure payment.</p>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={`${item.variantId}-${index}`} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{item.name} (x{item.quantity})</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardContent>
                 <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : `Pay with Razorpay`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
