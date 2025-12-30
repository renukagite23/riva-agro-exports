import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct } from '@/lib/models/Product';
import { appendFile } from 'fs/promises';
import { join } from 'path';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') || '6943e8650bfb5a096f7449fa';
  const logPath = join(process.cwd(), 'product-update.log');
  const existing = await getProductById(id);
  await appendFile(logPath, JSON.stringify({ time: new Date().toISOString(), event: 'debug-get', id, existing: !!existing }) + '\n');

  try {
    const updated = await updateProduct(id, { name: 'Makka Debug Endpoint' });
    await appendFile(logPath, JSON.stringify({ time: new Date().toISOString(), event: 'debug-update', id, updatedPresent: !!updated }) + '\n');
    return NextResponse.json({ existing: !!existing, updated: !!updated, updatedProduct: updated });
  } catch (err) {
    await appendFile(logPath, JSON.stringify({ time: new Date().toISOString(), event: 'debug-error', id, error: String(err) }) + '\n');
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}