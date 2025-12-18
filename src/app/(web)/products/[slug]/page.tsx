import { notFound } from 'next/navigation';
import { getProducts } from '@/lib/models/Product';
import { ProductDetails } from '@/components/product-details';
import { ProductRecommendations } from '@/components/product-recommendations';
import type { Product } from '@/lib/types';

async function getProductBySlug(slug: string): Promise<Product | null> {
    const products = await getProducts();
    const product = products.find(p => p.slug === slug);
    return product || null;
}

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <>
      <ProductDetails product={product} />
      <ProductRecommendations products={relatedProducts} />
    </>
  );
}
