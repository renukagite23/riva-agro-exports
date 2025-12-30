import { NextRequest, NextResponse } from "next/server";
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/lib/models/Category";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

/* ================= GET ================= */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const category = await getCategoryById(id);

  if (!category) {
    return NextResponse.json(
      { message: "Category not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(category);
}

/* ================= PUT (UPDATE CATEGORY) ================= */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const formData = await req.formData();

  const updateData: any = {};

  /* ---------- fields ---------- */
  const name = formData.get("name");
  if (name) updateData.name = String(name).trim();

  updateData.featured = formData.get("featured") === "true";

  const status = formData.get("status");
  if (status === "active" || status === "inactive") {
    updateData.status = status;
  }

  /* ---------- image (optional) ---------- */
  const image = formData.get("image") as File | null;

  if (image && image.size > 0) {
    const uploadDir = join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await image.arrayBuffer());
    const filename = `${Date.now()}-${image.name}`;

    await writeFile(join(uploadDir, filename), buffer);

    updateData.image = `/uploads/${filename}`;
  }

  /* ---------- update ---------- */
  const updated = await updateCategory(id, updateData);

  if (!updated) {
    return NextResponse.json(
      { message: "Category not found" },
      { status: 404 }
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

  const success = await deleteCategory(id);

  if (!success) {
    return NextResponse.json(
      { message: "Category not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Category deleted successfully",
  });
}
