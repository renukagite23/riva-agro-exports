import { NextRequest, NextResponse } from "next/server";
import { createProduct, getProducts } from "@/lib/models/Product";
import { getCategories } from "@/lib/models/Category";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

/* ================= GET ALL / BY CATEGORY ================= */
/*
  IMPORTANT:
  - Products store `category` as CATEGORY NAME (string)
  - Import Product sends `categoryId` (_id)
  - So we must map: categoryId → category.name
*/

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");

  let products = await getProducts();

  if (categoryId) {
    const categories = await getCategories();

    // ✅ Correct comparison: Mongo _id ↔ categoryId
    const category = categories.find(
      (c: any) => String(c._id) === String(categoryId)
    );

    if (!category) {
      return NextResponse.json([]);
    }

    // ✅ Filter products by CATEGORY NAME
    products = products.filter(
      (p: any) => p.category === category.name
    );
  }

  return NextResponse.json(products);
}

/* ================= CREATE PRODUCT ================= */
/*
  NOTE:
  - Category is saved as CATEGORY NAME (not id)
  - This matches existing DB structure
*/

export async function POST(req: NextRequest) {
  const data = await req.formData();

  const name = data.get("name")?.toString().trim();
  const description = data.get("description")?.toString().trim();
  const category = data.get("category")?.toString().trim(); // ✅ CATEGORY NAME
  const hsCode = data.get("hsCode")?.toString().trim();

  const minOrderQty = data.get("minOrderQty")?.toString().trim();
  const discountedPrice = Number(data.get("discountedPrice"));
  const sellingPrice = Number(data.get("sellingPrice"));

  const featured = data.get("featured") === "true";
  const status =
    data.get("status") === "inactive" ? "inactive" : "active";

  const images = data.getAll("images") as File[];

  /* ================= VALIDATION ================= */

  if (
    !name ||
    !description ||
    !category ||
    !hsCode ||
    !minOrderQty ||
    isNaN(discountedPrice) ||
    isNaN(sellingPrice) ||
    !images.length
  ) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  /* ================= IMAGE UPLOAD ================= */

  const uploadDir = join(process.cwd(), "public/uploads");
  await mkdir(uploadDir, { recursive: true });

  const imageUrls: string[] = [];

  for (const image of images) {
    if (image.size === 0) continue;

    const buffer = Buffer.from(await image.arrayBuffer());
    const filename = `${Date.now()}-${image.name}`;

    await writeFile(join(uploadDir, filename), buffer);
    imageUrls.push(`/uploads/${filename}`);
  }

  if (!imageUrls.length) {
    return NextResponse.json(
      { message: "Image upload failed" },
      { status: 400 }
    );
  }

  /* ================= CREATE PRODUCT ================= */

  const product = await createProduct({
    name,
    description,
    category, // ✅ stored as category NAME

    hsCode,
    minOrderQty,
    discountedPrice,
    sellingPrice,

    images: imageUrls,
    primaryImage: imageUrls[0],

    featured,
    status,
  });

  return NextResponse.json(product, { status: 201 });
}
