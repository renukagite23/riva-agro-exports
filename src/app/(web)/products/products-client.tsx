"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  categories: any[];
  products: any[];
};

/* ================= PRICE RANGES ================= */
const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "Under ₹1000", min: 0, max: 1000 },
  { label: "Under ₹2000", min: 0, max: 2000 },
  { label: "Under ₹5000", min: 0, max: 5000 },
  { label: "Above ₹5000", min: 5000, max: Infinity },
];

export default function ProductsClient({ categories, products }: Props) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  /* ================= HANDLERS ================= */

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name]
    );
  };

  const togglePrice = (label: string) => {
    setSelectedPrices((prev) =>
      prev.includes(label)
        ? prev.filter((p) => p !== label)
        : [...prev, label]
    );
  };

  /* ================= FILTER LOGIC ================= */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const category =
        product.categoryName || product.category;

      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(category);

      const price =
        product.discountedPrice ?? product.sellingPrice ?? 0;

      const priceMatch =
        selectedPrices.length === 0 ||
        selectedPrices.some((label) => {
          const range = PRICE_RANGES.find(
            (r) => r.label === label
          );
          if (!range) return false;
          return price >= range.min && price <= range.max;
        });

      return (
        categoryMatch &&
        priceMatch &&
        product.status === "active"
      );
    });
  }, [products, selectedCategories, selectedPrices]);

  return (
    <section className="container py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">

        {/* ================= SIDEBAR ================= */}
        <aside className="space-y-12">

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Categories
            </h3>

            <div className="space-y-3">
              {categories.map((cat) => (
                <label
                  key={cat.slug}
                  className="flex items-center gap-3 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.name)}
                    onChange={() => toggleCategory(cat.name)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>

            {selectedCategories.length > 0 && (
              <button
                onClick={() => setSelectedCategories([])}
                className="mt-4 text-xs text-muted-foreground underline"
              >
                Clear categories
              </button>
            )}
          </div>

          {/* Price (Checkbox) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Price
            </h3>

            <div className="space-y-3">
              {PRICE_RANGES.map((range) => (
                <label
                  key={range.label}
                  className="flex items-center gap-3 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPrices.includes(range.label)}
                    onChange={() => togglePrice(range.label)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>

            {selectedPrices.length > 0 && (
              <button
                onClick={() => setSelectedPrices([])}
                className="mt-4 text-xs text-muted-foreground underline"
              >
                Clear price filters
              </button>
            )}
          </div>
        </aside>

        {/* ================= PRODUCTS GRID ================= */}
        <div>
          <h1 className="text-2xl font-semibold mb-8">
            All Products
          </h1>

          {filteredProducts.length === 0 ? (
            <p className="text-muted-foreground">
              No products found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {filteredProducts.map((product, index) => {
                const sellingPrice = product.sellingPrice;
                const discountedPrice = product.discountedPrice;

                return (
                  <div
                    key={`${product.slug}-${index}`}
                    className="group bg-white rounded-2xl shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                  >
                    <Link href={`/products/${product.slug}`}>
                      {/* Image */}
                      {/* Image + Hover Overlay */}
<div className="relative aspect-[4/5] bg-gray-50 rounded-t-xl overflow-hidden">
  <Image
    src={
      product.primaryImage ||
      product.images?.[0] ||
      "/uploads/default-product.jpg"
    }
    alt={product.name}
    fill
    className="object-contain p-6 transition group-hover:scale-105"
  />

  {/* Hover Overlay */}
  <div
    className="
      absolute inset-0
      flex items-center justify-center
      bg-black/40
      opacity-0
      transition-opacity duration-300
      group-hover:opacity-100
    "
  >
    <span
      className="
        rounded-full bg-white px-6 py-2
        text-sm font-semibold text-gray-900
        shadow-lg
      "
    >
      View Product
    </span>
  </div>
</div>


                      {/* Content */}
                      <div className="p-5 space-y-1">
                        <h3 className="text-base font-semibold">
                          {product.name}
                        </h3>

                        {product.categoryName && (
                          <p className="text-sm text-muted-foreground">
                            {product.categoryName}
                          </p>
                        )}

                        <div className="flex items-center gap-2 pt-2">
                          {sellingPrice && discountedPrice && (
                            <span className="text-sm line-through text-gray-400">
                              ₹{sellingPrice}
                            </span>
                          )}
                          <span className="text-lg font-bold">
                            ₹{discountedPrice ?? sellingPrice}
                          </span>
                        </div>

                        {product.minOrderQty && (
                          <span className="inline-block mt-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                            MOQ: {product.minOrderQty}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}