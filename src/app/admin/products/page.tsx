'use client';

import * as React from 'react';
import Image from 'next/image';
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

import type { Product, Category } from '@/lib/types';
import { ProductModal } from '@/components/admin/product-modal';

/* ================= CONSTANTS ================= */

const ITEMS_PER_PAGE = 5;

/* ================= PAGE ================= */

export default function AdminProductsPage() {
  const { toast } = useToast();

  /* ===== data ===== */
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  /* ===== filters ===== */
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] =
    React.useState<'all' | 'active' | 'inactive'>('all');

  /* ===== pagination ===== */
  const [currentPage, setCurrentPage] = React.useState(1);

  /* ===== modal ===== */
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] =
    React.useState<'add' | 'edit' | 'view'>('add');
  const [selectedProduct, setSelectedProduct] =
    React.useState<Product | null>(null);

  /* ================= FETCH ================= */

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch('/api/products');
    setProducts(await res.json());
    setLoading(false);
    setCurrentPage(1);
  };

  React.useEffect(() => {
    fetchProducts();
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    const ok = confirm('Delete this product?');
    if (!ok) return;

    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      toast({
        variant: 'destructive',
        title: 'Delete failed',
      });
      return;
    }

    toast({ title: 'Product deleted' });
    fetchProducts();
  };

  /* ================= FILTER ================= */

  const filteredProducts = products
    .filter(
      (p) =>
        statusFilter === 'all' || p.status === statusFilter
    )
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(
    filteredProducts.length / ITEMS_PER_PAGE
  );

  const paginatedProducts = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredProducts, currentPage]);

  /* ================= UI ================= */

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">
            Product List
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage products, pricing & visibility
          </p>
        </div>

        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => {
            setMode('add');
            setSelectedProduct(null);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* TABLE */}
      <Card>
        <CardContent className="pt-4">
          <Tabs
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as any);
              setCurrentPage(1);
            }}
          >
            <div className="flex justify-between mb-3">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">
                  Active
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Inactive
                </TabsTrigger>
              </TabsList>

              <div className="relative w-[220px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4" />
                <Input
                  className="pl-8 h-9"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <TabsContent value={statusFilter}>
              {loading ? (
                <div className="py-10 text-center">
                  Loading…
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>MOQ</TableHead>
                        <TableHead className="text-right">
                          Discounted
                        </TableHead>
                        <TableHead className="text-right">
                          MRP
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {paginatedProducts.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>
                            <Image
                              src={
                                p.images?.[0] ||
                                '/placeholder.png'
                              }
                              width={40}
                              height={40}
                              alt={p.name}
                              className="rounded"
                            />
                          </TableCell>

                          <TableCell className="font-medium">
                            {p.name}
                          </TableCell>

                          <TableCell>
                            {p.minOrderQty || '—'}
                          </TableCell>

                          <TableCell className="text-right">
                            ₹{p.discountedPrice ?? 0}
                          </TableCell>

                          <TableCell className="text-right">
                            ₹{p.sellingPrice ?? 0}
                          </TableCell>

                          <TableCell>
                            <Badge>{p.status}</Badge>
                          </TableCell>

                          <TableCell className="text-center space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedProduct(p);
                                setMode('view');
                                setOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedProduct(p);
                                setMode('edit');
                                setOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4 text-blue-600" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDelete(p.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* PAGINATION */}
                  {filteredProducts.length >
                    ITEMS_PER_PAGE && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </p>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() =>
                            setCurrentPage((p) => p - 1)
                          }
                        >
                          Previous
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            currentPage === totalPages
                          }
                          onClick={() =>
                            setCurrentPage((p) => p + 1)
                          }
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* PRODUCT MODAL */}
      <ProductModal
        open={open}
        mode={mode}
        product={selectedProduct}
        categories={categories}
        onClose={() => setOpen(false)}
        onSaved={fetchProducts}
      />
    </>
  );
}
