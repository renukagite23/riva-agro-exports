import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/models/Product';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const data = await req.formData();
        
        const updateData: Partial<any> = {};

        if (data.has('name')) updateData.name = data.get('name');
        if (data.has('description')) updateData.description = data.get('description');
        if (data.has('category')) updateData.category = data.get('category');
        if (data.has('hsCode')) updateData.hsCode = data.get('hsCode');
        if (data.has('featured')) updateData.featured = data.get('featured') === 'true';
        if (data.has('status')) updateData.status = data.get('status');
        if (data.has('variants')) updateData.variants = JSON.parse(data.get('variants') as string);
        if (data.has('existingImages')) {
            const existingImages = data.get('existingImages');
            updateData.images = existingImages ? (existingImages as string).split(',') : [];
        }


        const newImages = data.getAll('images') as File[];
        if (newImages && newImages.length > 0 && newImages[0].size > 0) {
            const imageUrls : string[] = updateData.images || [];
            const uploadDir = join(process.cwd(), 'public', 'uploads');
            await mkdir(uploadDir, { recursive: true });

            for (const imageFile of newImages) {
                const bytes = await imageFile.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const filename = `${Date.now()}-${imageFile.name}`;
                const path = join(uploadDir, filename);
                await writeFile(path, buffer);
                imageUrls.push(`/uploads/${filename}`);
            }
            updateData.images = imageUrls;
        }
        
        const updatedProduct = await updateProduct(id, updateData);

        if (!updatedProduct) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        
        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        console.error('Failed to update product:', error);
        return NextResponse.json({ message: `Failed to update product: ${error}` }, { status: 500 });
    }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    // Note: You might want to delete associated images from the filesystem here
    const success = await deleteProduct(id);
    if (success) {
      return NextResponse.json({ message: 'Product deleted successfully' });
    } else {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ message: 'Failed to delete product' }, { status: 500 });
  }
}
