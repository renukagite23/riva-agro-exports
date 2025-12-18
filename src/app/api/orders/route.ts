import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders } from '@/lib/models/Order';
import type { Order } from '@/lib/types';

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const orderData: Omit<Order, 'id' | '_id'> = await req.json();

    if (!orderData || !orderData.userId || !orderData.items || !orderData.total) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newOrder = await createOrder(orderData);
    
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
  }
}
