import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import type { Category } from '../types';

let client: MongoClient;
let db: Db;
let categories: Collection<Omit<Category, 'id'>>;

async function init() {
  if (db) {
    return;
  }
  try {
    client = await clientPromise;
    db = client.db();
    categories = db.collection('categories');
  } catch (error) {
    throw new Error('Failed to connect to the database.');
  }
}

(async () => {
  await init();
})();

function toCategory(doc: any): Category {
    const { _id, ...rest } = doc;
    return { ...rest, id: _id.toHexString() } as Category;
}

export const getCategories = async (): Promise<Category[]> => {
  if (!categories) await init();
  const result = await categories.find({}).sort({ name: 1 }).toArray();
  return result.map(toCategory);
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
    if (!categories) await init();
    if (!ObjectId.isValid(id)) return null;
    const doc = await categories.findOne({ _id: new ObjectId(id) });
    if (!doc) return null;
    return toCategory(doc);
}

export const createCategory = async (data: Omit<Category, 'id' | 'slug'>): Promise<Category> => {
    if (!categories) await init();
    
    const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const result = await categories.insertOne({
        ...data,
        slug,
    });
    
    const newCategory = await categories.findOne({ _id: result.insertedId });
    if (!newCategory) {
        throw new Error('Failed to create category');
    }
    return toCategory(newCategory);
}

export const updateCategory = async (id: string, data: Partial<Omit<Category, 'id' | 'slug'>>): Promise<Category | null> => {
    if (!categories) await init();
    if (!ObjectId.isValid(id)) return null;

    const updateDoc: any = { $set: {} };
    if (data.name) {
        updateDoc.$set.name = data.name;
        updateDoc.$set.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    if (data.featured !== undefined) updateDoc.$set.featured = data.featured;
    if (data.status) updateDoc.$set.status = data.status;
    if (data.image) updateDoc.$set.image = data.image;

    const result = await categories.findOneAndUpdate(
        { _id: new ObjectId(id) },
        updateDoc,
        { returnDocument: 'after' }
    );
    
    return result ? toCategory(result) : null;
}

export const deleteCategory = async (id: string): Promise<boolean> => {
    if (!categories) await init();
    if (!ObjectId.isValid(id)) return false;
    const result = await categories.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
}
