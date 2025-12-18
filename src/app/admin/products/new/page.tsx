'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import type { Category } from '@/lib/types';

const variantSchema = z.object({
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
  images: z.any().refine((files) => files?.length > 0, 'At least one image is required.'),
  status: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch categories.',
        });
      }
    };
    fetchCategories();
  }, [toast]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      hsCode: '',
      variants: [{ name: '', price: 0 }],
      status: true,
      featured: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });
  
  const imageRef = form.register("images");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('category', values.category);
    formData.append('hsCode', values.hsCode);
    formData.append('variants', JSON.stringify(values.variants));
    formData.append('featured', String(values.featured));
    formData.append('status', values.status ? 'active' : 'inactive');

    if (values.images) {
      for (let i = 0; i < values.images.length; i++) {
        formData.append('images', values.images[i]);
      }
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      toast({
        title: '✅ Product created',
        description: 'The new product has been added successfully.',
      });
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/admin/products">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Add New Product
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/products">Cancel</Link>
            </Button>
            <Button size="sm" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Fill in the details of the new product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField name="name" render={({ field }) => (
                  <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input placeholder="e.g., Yellow Maize" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Provide a detailed description..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Category & Variants</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField name="hsCode" render={({ field }) => (
                  <FormItem><FormLabel>HS Code</FormLabel><FormControl><Input placeholder="e.g., 1005.90.00" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
              <CardContent>
                <Label>Variants</Label>
                 <div className="space-y-4 mt-2">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                         <FormField
                          control={form.control}
                          name={`variants.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Variant Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Feed Grade" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name={`variants.${index}.price`}
                          render={({ field }) => (
                             <FormItem>
                              <FormLabel>Price (₹)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="e.g., 250" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {fields.length > 1 && (
                        <Button variant="destructive" size="sm" className="mt-4" onClick={() => remove(index)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Remove Variant
                        </Button>
                      )}
                    </Card>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ name: '', price: 0 })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Variant
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Upload images for the product gallery (at least one is required).</CardDescription>
              </CardHeader>
              <CardContent>
                 <FormField
                  control={form.control}
                  name="images"
                  render={() => (
                    <FormItem>
                       <FormControl>
                        <Input type="file" accept="image/*" multiple {...imageRef} />
                       </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
              <CardHeader><CardTitle>Product Status</CardTitle></CardHeader>
              <CardContent>
                <FormField name="status" render={({ field }) => (
                  <FormItem><div className="flex items-center justify-between"><Label>Active</Label><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></div><p className="text-sm text-muted-foreground">Inactive products will not be visible.</p></FormItem>
                )} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Featured Product</CardTitle></CardHeader>
              <CardContent>
                 <FormField name="featured" render={({ field }) => (
                  <FormItem><div className="flex items-center justify-between"><Label>Featured</Label><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></div><p className="text-sm text-muted-foreground mt-4">Featured products appear on the homepage.</p></FormItem>
                )} />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 md:hidden mt-6">
          <Button variant="outline" size="sm" asChild><Link href="/admin/products">Cancel</Link></Button>
          <Button size="sm" type="submit" disabled={form.formState.isSubmitting}>
             {form.formState.isSubmitting ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
