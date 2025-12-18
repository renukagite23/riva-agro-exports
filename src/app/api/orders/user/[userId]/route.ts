import { NextRequest, NextResponse } from 'next/server';
import { getOrdersByUserId } from '@/lib/models/Order';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const orders = await getOrdersByUserId(userId);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    return NextResponse.json({ message: 'Failed to fetch user orders' }, { status: 500 });
  }
}
