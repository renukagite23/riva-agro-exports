import { NextRequest, NextResponse } from "next/server";
import { createCategory, getCategories } from "@/lib/models/Category";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

/* ================= GET (ALL CATEGORIES) ================= */
/* 🔹 Import Product will consume this */
export async function GET() {
  const categories = await getCategories();

  // ✅ IMPORTANT: return only active categories for dropdown
  const activeCategories = categories.filter(
    (c: any) => c.status === "active"
  );

  return NextResponse.json(activeCategories);
}

/* ================= POST (CREATE CATEGORY) ================= */
/* 🔹 Used only in Admin → Categories */
export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const name = formData.get("name")?.toString().trim();
  const featured = formData.get("featured") === "true";
  const status =
    formData.get("status") === "inactive" ? "inactive" : "active";
  const image = formData.get("image") as File | null;

  /* ---------- validation ---------- */

  if (!name) {
    return NextResponse.json(
      { message: "Category name is required" },
      { status: 400 }
    );
  }

  if (!image || image.size === 0) {
    return NextResponse.json(
      { message: "Category image is required" },
      { status: 400 }
    );
  }

  /* ---------- upload image ---------- */

  const uploadDir = join(process.cwd(), "public/uploads");
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await image.arrayBuffer());
  const filename = `${Date.now()}-${image.name}`;

  await writeFile(join(uploadDir, filename), buffer);

  /* ---------- create category ---------- */

  const newCategory = await createCategory({
    name,
    featured,
    status,
    image: `/uploads/${filename}`,
  });

  return NextResponse.json(newCategory, { status: 201 });
}
