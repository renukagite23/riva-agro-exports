import { NextRequest, NextResponse } from 'next/server';
import { createProduct, getProducts } from '@/lib/models/Product';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const name = data.get('name') as string;
    const description = data.get('description') as string;
    const category = data.get('category') as string;
    const hsCode = data.get('hsCode') as string;
    const variants = JSON.parse(data.get('variants') as string);
    const featured = data.get('featured') === 'true';
    const status = data.get('status') as 'active' | 'inactive';
    const images = data.getAll('images') as File[];

    if (!name || !description || !category || !variants || !hsCode || !images || images.length === 0) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const imageUrls: string[] = [];
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    for (const imageFile of images) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${imageFile.name}`;
      const path = join(uploadDir, filename);
      await writeFile(path, buffer);
      imageUrls.push(`/uploads/${filename}`);
    }

    const newProduct = await createProduct({
      name,
      description,
      category,
      hsCode,
      variants,
      images: imageUrls,
      featured,
      status,
    });
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
  }
}
