import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import type { Category } from '../types';

let client: MongoClient;
let db: Db;
let categories: Collection<Omit<Category, 'id'>>;

async function init() {
  if (categories) return;

  client = await clientPromise;
  db = client.db();
  categories = db.collection('categories');
}

function toCategory(doc: any): Category {
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toString() } as Category;
}

/* ================= GET ALL ================= */

export const getCategories = async (): Promise<Category[]> => {
  await init();
  const result = await categories.find({}).sort({ name: 1 }).toArray();
  return result.map(toCategory);
};

/* ================= GET BY ID ================= */

export const getCategoryById = async (id: string): Promise<Category | null> => {
  await init();
  if (!ObjectId.isValid(id)) return null;

  const doc = await categories.findOne({ _id: new ObjectId(id) });
  return doc ? toCategory(doc) : null;
};

/* ================= CREATE ================= */

export const createCategory = async (
  data: Omit<Category, 'id' | 'slug'>
): Promise<Category> => {
  await init();

  const slug = data.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');

  const result = await categories.insertOne({
    ...data,
    slug,
  });

  const doc = await categories.findOne({ _id: result.insertedId });
  if (!doc) throw new Error('Failed to create category');

  return toCategory(doc);
};

/* ================= UPDATE ================= */

export const updateCategory = async (
  id: string,
  data: Partial<Omit<Category, 'id' | 'slug'>>
): Promise<Category | null> => {
  await init();
  if (!ObjectId.isValid(id)) return null;

  const $set: any = {};

  if (data.name !== undefined) {
    $set.name = data.name;
    $set.slug = data.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  }

  if (data.featured !== undefined) $set.featured = data.featured;
  if (data.status !== undefined) $set.status = data.status;
  if (data.image !== undefined) $set.image = data.image;

  if (Object.keys($set).length === 0) return null;

  // ✅ Update
  const updateResult = await categories.updateOne(
    { _id: new ObjectId(id) },
    { $set }
  );

  if (updateResult.matchedCount === 0) return null;

  // ✅ Fetch updated document (TypeScript-safe)
  const updatedDoc = await categories.findOne({
    _id: new ObjectId(id),
  });

  return updatedDoc ? toCategory(updatedDoc) : null;
};


/* ================= DELETE ================= */

export const deleteCategory = async (id: string): Promise<boolean> => {
  await init();
  if (!ObjectId.isValid(id)) return false;

  const result = await categories.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
};
