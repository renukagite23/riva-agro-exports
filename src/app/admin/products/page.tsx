
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusCircle,
  Search,
  Pencil,
  Trash2,
  Eye,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
    PaginationLink,
} from '@/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { ProductDetailsModal } from '@/components/admin/product-details-modal';

export default function AdminProductsPage() {
    const [products, setProducts] = React.useState<Product[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
    const { toast } = useToast();

    const fetchProducts = React.useCallback(async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch products.',
        });
      } finally {
        setIsLoading(false);
      }
    }, [toast]);
    
    React.useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (productId: string) => {
        try {
          const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
          });
          if (!response.ok) throw new Error('Failed to delete');
          
          setProducts(products.filter(product => product.id !== productId));
          toast({
            title: '✅ Success',
            description: 'Product has been deleted.',
          });
        } catch (error) {
           toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to delete product.',
          });
        }
    };
    
    // Simple client-side search and filter
    const [searchTerm, setSearchTerm] = React.useState('');
    const [activeTab, setActiveTab] = React.useState('all');

    const filteredProducts = React.useMemo(() => {
        return products
            .filter(p => {
                if (activeTab === 'all') return true;
                return p.status === activeTab;
            })
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm, activeTab]);

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/admin/products/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            Manage your products and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
              <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <TabsContent value="all">
              <ProductTable products={filteredProducts} isLoading={isLoading} handleDelete={handleDelete} onView={(product) => setSelectedProduct(product)} />
            </TabsContent>
             <TabsContent value="active">
              <ProductTable products={filteredProducts} isLoading={isLoading} handleDelete={handleDelete} onView={(product) => setSelectedProduct(product)} />
            </TabsContent>
             <TabsContent value="inactive">
              <ProductTable products={filteredProducts} isLoading={isLoading} handleDelete={handleDelete} onView={(product) => setSelectedProduct(product)} />
            </TabsContent>
          </Tabs>
        </CardContent>
         <CardContent>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                     <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                     <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </CardContent>
      </Card>
      {selectedProduct && (
        <ProductDetailsModal
            product={selectedProduct}
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}


function ProductTable({ products, isLoading, handleDelete, onView }: { products: Product[], isLoading: boolean, handleDelete: (id: string) => void, onView: (product: Product) => void }) {
  if (isLoading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (products.length === 0) {
    return <div className="text-center py-8">No products found.</div>;
  }
    
  return (
     <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
             <TableCell>
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                />
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
            <TableCell>
              <Badge variant={product.status === 'active' ? 'default' : 'outline'}>
                {product.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">₹{product.variants[0]?.price.toFixed(2)}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onView(product)}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/products/edit/${product.id}`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        product "{product.name}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(product.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
