import { NextRequest, NextResponse } from "next/server";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/models/Product";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

/* ================= GET SINGLE PRODUCT ================= */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    return NextResponse.json(
      { message: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}

/* ================= UPDATE PRODUCT ================= */

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const formData = await req.formData();
  const updateData: any = {};

  if (formData.get("name"))
    updateData.name = String(formData.get("name"));

  if (formData.get("description"))
    updateData.description = String(formData.get("description"));

  if (formData.get("category"))
    updateData.category = String(formData.get("category"));

  if (formData.get("hsCode"))
    updateData.hsCode = String(formData.get("hsCode"));

  if (formData.get("minOrderQty"))
    updateData.minOrderQty = String(formData.get("minOrderQty"));

  if (formData.get("discountedPrice"))
    updateData.discountedPrice = Number(
      formData.get("discountedPrice")
    );

  if (formData.get("sellingPrice"))
    updateData.sellingPrice = Number(
      formData.get("sellingPrice")
    );

  updateData.featured = formData.get("featured") === "true";
  updateData.status =
    formData.get("status") === "active" ? "active" : "inactive";

  /* ================= IMAGES (FIXED) ================= */

  // 1️⃣ Parse existing images (even empty)
  let images: string[] = [];

  const existingImagesRaw = formData.get("existingImages");
  if (existingImagesRaw) {
    images = JSON.parse(String(existingImagesRaw));
  }

  // 2️⃣ Handle new uploads
  const files = formData.getAll("images") as File[];

  if (files.length && files[0].size > 0) {
    const uploadDir = join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;
      await writeFile(join(uploadDir, filename), buffer);
      images.push(`/uploads/${filename}`);
    }
  }

  // 3️⃣ ALWAYS overwrite images (even empty)
  updateData.images = images;
  updateData.primaryImage = images[0] || "";

  /* ================= UPDATE ================= */

  const updated = await updateProduct(id, updateData);

  if (!updated) {
    return NextResponse.json(
      { message: "Update failed" },
      { status: 400 }
    );
  }

  return NextResponse.json(updated);
}

/* ================= DELETE ================= */

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await deleteProduct(id);

  return NextResponse.json({ success: true });
}
