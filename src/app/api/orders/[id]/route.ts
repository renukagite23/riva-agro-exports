import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/lib/models/Order';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json({ message: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { status } = await req.json();

        if (!status) {
            return NextResponse.json({ message: 'Status is required' }, { status: 400 });
        }
        
        const updatedOrder = await updateOrderStatus(id, status);

        if (!updatedOrder) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }
        
        return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error) {
        console.error('Failed to update order status:', error);
        return NextResponse.json({ message: 'Failed to update order status' }, { status: 500 });
    }
}
