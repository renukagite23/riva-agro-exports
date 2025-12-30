import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import clientPromise from "../mongodb";
import type { Product } from "../types";

let client: MongoClient;
let db: Db;
let products: Collection<any>;

/* ================= INIT ================= */

async function init() {
  if (products) return;
  client = await clientPromise;
  db = client.db();
  products = db.collection("products");
}

/* ================= TRANSFORM ================= */

const toProduct = (doc: any): Product => {
  const { _id, categoryData, ...rest } = doc;

  return {
    ...rest,
    id: _id.toString(),
    category: rest.category?.toString(),
    categoryName: categoryData?.name ?? rest.categoryName,
    images: rest.images ?? [],
    primaryImage: rest.primaryImage ?? rest.images?.[0] ?? "",
    featured: rest.featured ?? false,
    status: rest.status ?? "inactive",

    // NEW FIELDS (SAFE DEFAULTS)
    minOrderQty: rest.minOrderQty ?? "",
    discountedPrice: rest.discountedPrice ?? 0,
    sellingPrice: rest.sellingPrice ?? 0,
  };
};

/* ================= GET ALL PRODUCTS ================= */

export const getProducts = async (): Promise<Product[]> => {
  await init();

  const result = await products
    .aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
    .toArray();

  return result.map(toProduct);
};

/* ================= GET PRODUCT BY ID ================= */

export const getProductById = async (
  id: string
): Promise<Product | null> => {
  await init();
  if (!ObjectId.isValid(id)) return null;

  const result = await products
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
    .toArray();

  return result[0] ? toProduct(result[0]) : null;
};

/* ================= CREATE PRODUCT ================= */

export const createProduct = async (
  data: Omit<Product, "id" | "slug" | "categoryName">
): Promise<Product> => {
  await init();

  const slug = data.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  const images = data.images ?? [];
  const primaryImage = images[0] ?? "";

  const result = await products.insertOne({
    name: data.name,
    description: data.description,
    category: new ObjectId(data.category),
    hsCode: data.hsCode,
    slug,

    // NEW FIELDS
    minOrderQty: data.minOrderQty,
    discountedPrice: data.discountedPrice,
    sellingPrice: data.sellingPrice,

    images,
    primaryImage,
    featured: data.featured ?? false,
    status: data.status ?? "inactive",

    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const doc = await products.findOne({ _id: result.insertedId });
  if (!doc) throw new Error("Create failed");

  return toProduct(doc);
};

/* ================= UPDATE PRODUCT ================= */

export const updateProduct = async (
  id: string,
  data: Partial<Omit<Product, "id" | "slug" | "categoryName">>
): Promise<Product | null> => {
  await init();
  if (!ObjectId.isValid(id)) return null;

  const $set: any = { updatedAt: new Date() };

  if (data.name !== undefined) {
    $set.name = data.name;
    $set.slug = data.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

  if (data.description !== undefined) $set.description = data.description;
  if (data.category !== undefined)
    $set.category = new ObjectId(data.category);
  if (data.hsCode !== undefined) $set.hsCode = data.hsCode;

  // NEW FIELDS
  if (data.minOrderQty !== undefined)
    $set.minOrderQty = data.minOrderQty;
  if (data.discountedPrice !== undefined)
    $set.discountedPrice = data.discountedPrice;
  if (data.sellingPrice !== undefined)
    $set.sellingPrice = data.sellingPrice;

  if (data.images !== undefined) {
    $set.images = data.images;
    $set.primaryImage = data.images[0] ?? "";
  }

  if (data.featured !== undefined) $set.featured = data.featured;
  if (data.status !== undefined) $set.status = data.status;

  if (!Object.keys($set).length) return null;

  const result = await products.updateOne(
    { _id: new ObjectId(id) },
    { $set }
  );

  if (!result.matchedCount) return null;

  const updated = await products.findOne({ _id: new ObjectId(id) });
  return updated ? toProduct(updated) : null;
};

/* ================= DELETE PRODUCT ================= */

export const deleteProduct = async (id: string): Promise<boolean> => {
  await init();
  if (!ObjectId.isValid(id)) return false;

  const result = await products.deleteOne({
    _id: new ObjectId(id),
  });

  return result.deletedCount === 1;
};
