'use client';

import Link from 'next/link';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { ChevronLeft, PlusCircle, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { Category, Product } from '@/lib/types';

const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Variant name is required'),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Price must be a positive number')
  ),
});

const formSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  hsCode: z.string().min(1, 'HS Code is required'),
  variants: z.array(variantSchema).min(1, 'At least one variant is required'),
  images: z.any().optional(),
  status: z.boolean(),
  featured: z.boolean(),
});

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { id: productId } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const isReadOnly = searchParams.get('readOnly') === 'true';

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    disabled: isReadOnly,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  useEffect(() => {
    async function fetchData() {
      if (!productId) return;
      setIsLoading(true);
      try {
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch('/api/categories')
        ]);

        if (productRes.status === 404) {
          notFound();
          return;
        }
        if (!productRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const productData: Product = await productRes.json();
        const categoriesData: Category[] = await categoriesRes.json();

        setProduct(productData);
        setCategories(categoriesData);
        setExistingImages(productData.images || []);

        form.reset({
          name: productData.name,
          description: productData.description,
          category: productData.category,
          hsCode: productData.hsCode,
          variants: productData.variants.map(v => ({...v, price: Number(v.price)})),
          status: productData.status === 'active',
          featured: productData.featured,
        });

      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch product data.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [productId, form, toast]);

  const imagesRef = form.register("images");

  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isReadOnly) return;
    
    setIsSubmitting(true);
    const formData = new FormData();

    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('category', values.category);
    formData.append('hsCode', values.hsCode);
    formData.append('variants', JSON.stringify(values.variants));
    formData.append('featured', String(values.featured));
    formData.append('status', values.status ? 'active' : 'inactive');
    formData.append('existingImages', existingImages.join(','));

    if (values.images) {
      for (let i = 0; i < values.images.length; i++) {
        formData.append('images', values.images[i]);
      }
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      toast({
        title: '✅ Product updated',
        description: 'The product has been updated successfully.',
      });
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
        <div>
            <Skeleton className="h-10 w-48 mb-6" />
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card><CardHeader><Skeleton className="h-6 w-40" /><Skeleton className="h-4 w-64 mt-2" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-6 w-40" /></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
                    <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
                </div>
            </div>
        </div>
    )
  }

  if (!product) {
    return notFound();
  }
  
  const pageTitle = isReadOnly ? `View Product: ${product.name}` : `Edit Product: ${product.name}`;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" className="h-7 w-7" asChild><Link href="/admin/products"><ChevronLeft className="h-4 w-4" /><span className="sr-only">Back</span></Link></Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">{pageTitle}</h1>
          {!isReadOnly && (
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm" asChild><Link href="/admin/products">Cancel</Link></Button>
              <Button size="sm" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
            </div>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader><CardTitle>Product Details</CardTitle><CardDescription>{isReadOnly ? 'Details for this product.' : 'Update the details of the product.'}</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                 <FormField name="name" render={({ field }) => (<FormItem><FormLabel>Product Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Category & Variants</CardTitle></CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{categories.map(cat => (<SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField name="hsCode" render={({ field }) => (<FormItem><FormLabel>HS Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </CardContent>
              <CardContent>
                <Label>Variants</Label>
                <div className="space-y-4 mt-2">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4"><div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name={`variants.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`variants.${index}.price`} render={({ field }) => (<FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>{!isReadOnly && <Button type="button" variant="destructive" size="sm" className="mt-4" onClick={() => remove(index)}><Trash2 className="mr-2 h-4 w-4" />Remove</Button>}</Card>
                  ))}
                  {!isReadOnly && <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ name: '', price: 0 })}><PlusCircle className="mr-2 h-4 w-4" />Add Variant</Button>}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Product Images</CardTitle><CardDescription>Manage images for the product.</CardDescription></CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {existingImages.map(image => (
                    <div key={image} className="relative group">
                      <Image src={image} alt="product image" width={100} height={100} className="rounded-md object-cover" />
                      {!isReadOnly && <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveExistingImage(image)}><Trash2 className="h-4 w-4" /></Button>}
                    </div>
                  ))}
                </div>
                {!isReadOnly && <FormField control={form.control} name="images" render={() => (
                  <FormItem><FormLabel>Add New Images</FormLabel><FormControl><Input type="file" accept="image/*" multiple {...imagesRef} /></FormControl><FormMessage /></FormItem>
                )} />}
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card><CardHeader><CardTitle>Product Status</CardTitle></CardHeader><CardContent>
              <FormField name="status" render={({ field }) => (<FormItem><div className="flex items-center justify-between"><Label>Active</Label><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></div><p className="text-sm text-muted-foreground mt-2">Inactive products will not be visible.</p></FormItem>)} />
            </CardContent></Card>
            <Card><CardHeader><CardTitle>Featured Product</CardTitle></CardHeader><CardContent>
              <FormField name="featured" render={({ field }) => (<FormItem><div className="flex items-center justify-between"><Label>Featured</Label><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></div><p className="text-sm text-muted-foreground mt-4">Featured products appear on the homepage.</p></FormItem>)} />
            </CardContent></Card>
          </div>
        </div>
        {!isReadOnly && (<div className="flex items-center justify-center gap-2 md:hidden mt-6">
            <Button variant="outline" size="sm" asChild><Link href="/admin/products">Cancel</Link></Button>
            <Button size="sm" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
        </div>)}
      </form>
    </Form>
  );
}
