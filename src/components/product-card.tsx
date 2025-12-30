import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import type { Product } from "@/lib/types";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

/* ================= HELPER ================= */

const getMinUnitPrice = (product: Product) => {
  if (!product.units || product.units.length === 0) return 0;
  return Math.min(...product.units.map((u) => Number(u.price)));
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl =
    product.images?.[0] ||
    "https://picsum.photos/seed/placeholder/400/300";

  const minPrice = getMinUnitPrice(product);
  const unitLabel = product.units?.[0]?.unit ?? "";

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-video">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint="product image"
            />
          </div>
        </Link>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <CardTitle className="mb-2 text-lg font-headline">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </CardTitle>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-lg font-semibold">
           ₹{minPrice.toFixed(2)}
          {unitLabel && (
            <span className="text-sm text-muted-foreground">
              {" "}
              / {unitLabel}
            </span>
          )}
        </p>

        <Button size="icon" asChild>
          <Link href={`/products/${product.slug}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
