"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Separator } from "@/components/ui/separator";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();

 const minOrderQty = product.minOrderQty;



// ✅ ALWAYS number, never null (for logic only)

  const sellingPrice = product.sellingPrice ?? 0;
  const discountedPrice =
    product.discountedPrice ?? sellingPrice;

const [quantity, setQuantity] = useState(0);
const [showFullDesc, setShowFullDesc] = useState(false);


  /* ================= CART HANDLERS ================= */

  const addInitialQty = () => {
  addToCart({
    productId: product.id,
    variantId: "default",
    name: product.name,
    variantName: "Standard",
    price: discountedPrice,
    image: product.images?.[0] ?? "",
  });

  setQuantity(1);
};

const increment = () => {
  addToCart({
    productId: product.id,
    variantId: "default",
    name: product.name,
    variantName: "Standard",
    price: discountedPrice,
    image: product.images?.[0] ?? "",
  });

  setQuantity((q) => q + 1);
};

const decrement = () => {
  setQuantity((q) => (q > 1 ? q - 1 : 1));
};

  /* ================= UI ================= */

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* IMAGE GALLERY */}
        <ProductImageGallery
          imageIds={product.images}
          productName={product.name}
        />

        {/* DETAILS */}
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            {product.name}
          </h1>

          {/* PRICE */}
          <div className="mt-4 flex items-end gap-3">
            <span className="text-2xl font-semibold text-green-600">
              ₹{discountedPrice}
            </span>

            {discountedPrice < sellingPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{sellingPrice}
              </span>
            )}
          </div>

          <Separator className="my-6" />

          {/* META INFO */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground">HS Code</p>
              <p className="font-medium">
                {product.hsCode}
              </p>
            </div>

     <div>
  <p className="text-muted-foreground">
    Minimum Order Quantity
  </p>
  <p className="font-medium">
 
  {minOrderQty}
</p>
</div>

          </div>

         {/* DESCRIPTION */}
{product.description && (
  <div className="mt-6">
    <h3 className="font-semibold mb-2">
      Description
    </h3>

    <div
      className={`
        whitespace-pre-line
        text-gray-700
        leading-relaxed
        transition-all duration-300
        ${showFullDesc ? "" : "max-h-40 overflow-hidden"}
      `}
    >
      {product.description}
    </div>

    {/* VIEW MORE / LESS */}
    <button
      onClick={() => setShowFullDesc((v) => !v)}
      className="mt-2 text-sm font-medium text-primary hover:underline"
    >
      {showFullDesc ? "View Less" : "View More"}
    </button>
  </div>
          )}

          {/* ADD TO CART / QTY */}
          <div className="mt-8">
            {quantity === 0 ? (
              <Button size="lg" onClick={addInitialQty}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={decrement}>
                  −
                </Button>

                <span className="text-lg font-semibold">
                  {quantity}
                </span>

                <Button variant="outline" onClick={increment}>
                  +
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}