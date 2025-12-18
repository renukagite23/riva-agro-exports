
import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '@/lib/models/User';

export async function GET(req: NextRequest) {
  try {
    const users = await getUsers();
    // Filter out admins and omit passwords from the response
    const customers = users
      .filter(user => user.role === 'User')
      .map(user => {
        const { password, ...rest } = user;
        return rest;
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
  }
}
