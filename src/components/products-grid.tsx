"use client";

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { Category, Product } from '@/lib/types';

interface ProductsGridProps {
  categories: Category[];
  products: Product[];
}

export function ProductsGrid({ categories, products }: ProductsGridProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : categories.map(c => c.slug));
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 1000;
    return Math.max(...products.flatMap(p => p.variants.map(v => v.price)));
  }, [products]);
  const [priceRange, setPriceRange] = useState<[number]>([maxPrice]);
  const [showFeatured, setShowFeatured] = useState(false);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const priceMatch = product.variants.some(v => v.price <= priceRange[0]);
      const featuredMatch = !showFeatured || product.featured;
      return categoryMatch && priceMatch && featuredMatch;
    });
  }, [products, selectedCategories, priceRange, showFeatured]);

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Category</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.slug}
                        checked={selectedCategories.includes(category.slug)}
                        onCheckedChange={() => handleCategoryChange(category.slug)}
                      />
                      <Label htmlFor={category.slug}>{category.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Price Range</h3>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹0</span>
                  <span>₹{priceRange[0]}</span>
                </div>
                <Slider
                  defaultValue={[maxPrice]}
                  max={maxPrice}
                  step={10}
                  onValueChange={(value) => setPriceRange(value as [number])}
                  className="mt-2"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={showFeatured}
                    onCheckedChange={(checked) => setShowFeatured(Boolean(checked))}
                  />
                  <Label htmlFor="featured">Show Featured Only</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid */}
        <main className="md:col-span-3">
          <h1 className="font-headline text-3xl font-bold tracking-tight mb-6">Our Products</h1>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold">No Products Found</h2>
              <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
