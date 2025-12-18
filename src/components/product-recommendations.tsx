import type { Product } from '@/lib/types';
import { ProductCard } from './product-card';

interface ProductRecommendationsProps {
  products: Product[];
}

export function ProductRecommendations({ products }: ProductRecommendationsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="container pb-16">
      <div className="mt-16">
        <h2 className="font-headline text-3xl font-bold tracking-tight">
          You Might Also Like
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
