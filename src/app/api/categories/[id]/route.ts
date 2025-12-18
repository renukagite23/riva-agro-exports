import { NextRequest, NextResponse } from 'next/server';
import { getCategoryById, updateCategory, deleteCategory } from '@/lib/models/Category';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const category = await getCategoryById(id);
    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return NextResponse.json({ message: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const data = await req.formData();
        const name = data.get('name') as string;
        const featured = data.get('featured') === 'true';
        const status = data.get('status') as 'active' | 'inactive';
        const imageFile = data.get('image') as File | null;

        const updateData: Partial<{ name: string; featured: boolean; status: 'active' | 'inactive'; image?: string }> = {
            name,
            featured,
            status,
        };

        if (imageFile) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadDir = join(process.cwd(), 'public', 'uploads');
            const filename = `${Date.now()}-${imageFile.name}`;
            const path = join(uploadDir, filename);

            await mkdir(uploadDir, { recursive: true });
            await writeFile(path, buffer);
            updateData.image = `/uploads/${filename}`;
        }
        
        const updatedCategory = await updateCategory(id, updateData);

        if (!updatedCategory) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }
        
        return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error) {
        console.error('Failed to update category:', error);
        return NextResponse.json({ message: 'Failed to update category' }, { status: 500 });
    }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const success = await deleteCategory(id);
    if (success) {
      return NextResponse.json({ message: 'Category deleted successfully' });
    } else {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to delete category:', error);
    return NextResponse.json({ message: 'Failed to delete category' }, { status: 500 });
  }
}
