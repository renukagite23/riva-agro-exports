import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import type { Product } from '../types';

let client: MongoClient;
let db: Db;
let products: Collection<Omit<Product, 'id'>>;

async function init() {
  if (db) {
    return;
  }
  try {
    client = await clientPromise;
    db = client.db();
    products = db.collection('products');
  } catch (error) {
    throw new Error('Failed to connect to the database.');
  }
}

(async () => {
  await init();
})();

function toProduct(doc: any): Product {
    const { _id, ...rest } = doc;
    return { ...rest, id: _id.toHexString() } as Product;
}

export const getProducts = async (): Promise<Product[]> => {
  if (!products) await init();
  const result = await products.find({}).sort({ name: 1 }).toArray();
  return result.map(toProduct);
};

export const getProductById = async (id: string): Promise<Product | null> => {
    if (!products) await init();
    if (!ObjectId.isValid(id)) return null;
    const doc = await products.findOne({ _id: new ObjectId(id) });
    if (!doc) return null;
    return toProduct(doc);
}

export const createProduct = async (data: Omit<Product, 'id' | 'slug'>): Promise<Product> => {
    if (!products) await init();
    
    const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const result = await products.insertOne({
        ...data,
        slug,
    });
    
    const newProduct = await products.findOne({ _id: result.insertedId });
    if (!newProduct) {
        throw new Error('Failed to create product');
    }
    return toProduct(newProduct);
}

export const updateProduct = async (id: string, data: Partial<Omit<Product, 'id' | 'slug'>>): Promise<Product | null> => {
    if (!products) await init();
    if (!ObjectId.isValid(id)) return null;

    const updateDoc: any = { $set: {} };
    if (data.name) {
        updateDoc.$set.name = data.name;
        updateDoc.$set.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    if (data.description) updateDoc.$set.description = data.description;
    if (data.category) updateDoc.$set.category = data.category;
    if (data.variants) updateDoc.$set.variants = data.variants;
    if (data.hsCode) updateDoc.$set.hsCode = data.hsCode;
    if (data.images) updateDoc.$set.images = data.images;
    if (data.featured !== undefined) updateDoc.$set.featured = data.featured;
    if (data.status) updateDoc.$set.status = data.status;

    if (Object.keys(updateDoc.$set).length === 0) {
        return getProductById(id);
    }

    const result = await products.findOneAndUpdate(
        { _id: new ObjectId(id) },
        updateDoc,
        { returnDocument: 'after' }
    );
    
    return result ? toProduct(result) : null;
}

export const deleteProduct = async (id: string): Promise<boolean> => {
    if (!products) await init();
    if (!ObjectId.isValid(id)) return false;
    const result = await products.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
}
