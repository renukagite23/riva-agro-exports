
'use client';

import Link from 'next/link';
import { useRouter, notFound, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const formSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  image: z.any().optional(),
  status: z.boolean(),
  featured: z.boolean(),
});

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const isReadOnly = searchParams.get('readOnly') === 'true';

  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      status: true,
      featured: false,
    },
    disabled: isReadOnly,
  });

  const imageRef = form.register("image");

  useEffect(() => {
    const categoryId = params.id;
    if (!categoryId) {
      setIsLoading(false);
      return;
    }

    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`);
        if (response.status === 404) {
            notFound();
            return;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch category');
        }
        const data: Category = await response.json();
        setCategory(data);
        form.reset({
            name: data.name,
            status: data.status === 'active',
            featured: data.featured,
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch category data.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategory();
    
  }, [params, toast, form, notFound]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const categoryId = params.id;
    if (!categoryId) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('featured', String(values.featured));
    formData.append('status', values.status ? 'active' : 'inactive');
    if (values.image && values.image.length > 0) {
        formData.append('image', values.image[0]);
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      toast({
        title: '✅ Category updated',
        description: 'The category has been updated successfully.',
      });
      router.push('/admin/categories');
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
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-64 mt-2" />
                        </CardHeader>
                        <CardContent><Skeleton className="h-24 w-full" /></CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                           <Skeleton className="h-6 w-40" />
                           <Skeleton className="h-4 w-64 mt-2" />
                        </CardHeader>
                        <CardContent><Skeleton className="h-32 w-full" /></CardContent>
                    </Card>
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
                    <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
                </div>
            </div>
        </div>
    )
  }

  if (!category) {
    return notFound();
  }
  
  const pageTitle = isReadOnly ? `View Category: ${category.name}` : `Edit Category: ${category.name}`;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/admin/categories">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {pageTitle}
          </h1>
          {!isReadOnly && (
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm" asChild>
                <Link href="/admin/categories">Cancel</Link>
                </Button>
                <Button size="sm" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
                <CardDescription>
                  {isReadOnly ? 'Details for this category.' : 'Update the details of the category.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
           <Card>
            <CardHeader>
                <CardTitle>Category Image</CardTitle>
                <CardDescription>{isReadOnly ? 'Current category image.' : 'Upload a new image to replace the current one.'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {category.image && (
                    <div className="relative w-32 h-32">
                        <Image src={category.image} alt={category.name} fill className="object-cover rounded-md" unoptimized/>
                    </div>
                )}
                 {!isReadOnly && <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>New Image (optional)</FormLabel>
                       <FormControl>
                          <Input 
                              type="file" 
                              accept="image/*" 
                              {...imageRef}
                          />
                       </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />}
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Category Status</CardTitle>
            </CardHeader>
            <CardContent>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="status">Active</Label>
                        <FormControl>
                            <Switch
                                id="status"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isReadOnly}
                            />
                        </FormControl>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Inactive categories will not be visible on the website.
                      </p>
                    </FormItem>
                  )}
                />
              </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Featured Category</CardTitle>
            </CardHeader>
            <CardContent>
               <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                     <FormItem className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="featured">Featured</Label>
                             <FormControl>
                                <Switch
                                    id="featured"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isReadOnly}
                                />
                            </FormControl>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            Featured categories will appear on the homepage.
                        </p>
                    </FormItem>
                  )}
                />
            </CardContent>
          </Card>
        </div>
      </div>
      {!isReadOnly && (
        <div className="flex items-center justify-center gap-2 md:hidden mt-6">
            <Button variant="outline" size="sm" asChild>
            <Link href="/admin/categories">Cancel</Link>
            </Button>
            <Button size="sm" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
      )}
      </form>
    </Form>
  );
}
