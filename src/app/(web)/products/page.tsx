import { Suspense } from "react";
import { getCategories } from "@/lib/models/Category";
import { getProducts } from "@/lib/models/Product";
import ProductsClient from "./products-client";

async function getData() {
  try {
    const [categories, products] = await Promise.all([
      getCategories(),
      getProducts(),
    ]);

    return { categories, products };
  } catch (error) {
    console.error("DB error, returning empty data", error);
    return { categories: [], products: [] };
  }
}

export default async function ProductsPage() {
  const data = await getData();

  return (
    <Suspense fallback={<div className="p-10 text-center">Loading products…</div>}>
      <ProductsClient {...data} />
    </Suspense>
  );
}