"use client";

import { ProductsGrid } from "@/components/products-grid";

type Props = {
  categories: any[];
  products: any[];
};

export default function ProductsClient({ categories, products }: Props) {
  // If you want searchParams / filters / sorting
  // you can safely use them HERE later

  return (
    <ProductsGrid
      categories={categories}
      products={products}
    />
  );
}
