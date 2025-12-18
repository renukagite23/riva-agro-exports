import { NextRequest, NextResponse } from 'next/server';
import { createCategory, getCategories } from '@/lib/models/Category';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const name = data.get('name') as string;
    const featured = data.get('featured') === 'true';
    const status = data.get('status') as 'active' | 'inactive';
    const imageFile = data.get('image') as File | null;

    if (!name || !imageFile) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Handle image upload
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filename = `${Date.now()}-${imageFile.name}`;
    const path = join(uploadDir, filename);

    // Ensure the upload directory exists
    await mkdir(uploadDir, { recursive: true });
    
    await writeFile(path, buffer);
    const imageUrl = `/uploads/${filename}`;

    const newCategory = await createCategory({
      name,
      featured,
      image: imageUrl,
      status,
    });
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Failed to create category:', error);
    return NextResponse.json({ message: 'Failed to create category' }, { status: 500 });
  }
}
