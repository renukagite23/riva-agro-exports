'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';

/* ================= SCHEMA ================= */

const formSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  image: z.custom<FileList>().optional(),
  status: z.boolean(),
  featured: z.boolean(),
});

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const isReadOnly = searchParams.get('readOnly') === 'true';

  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const hasFetched = useRef(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      status: true,
      featured: false,
    },
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!id || hasFetched.current) return;
    hasFetched.current = true;

    (async () => {
      try {
        const res = await fetch(`/api/categories/${id}`);
        if (!res.ok) {
          router.replace('/admin/categories');
          return;
        }

        const data: Category = await res.json();
        setCategory(data);
        setPreviewImage(data.image ?? null);

        form.reset({
          name: data.name,
          status: data.status === 'active',
          featured: data.featured,
        });
      } catch {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch category',
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  /* ================= SUBMIT ================= */

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!id || isReadOnly) return;

    setIsSubmitting(true);
    const formData = new FormData();

    formData.append('name', values.name);
    formData.append('status', values.status ? 'active' : 'inactive');
    formData.append('featured', String(values.featured));

    if (values.image?.[0]) {
      formData.append('image', values.image[0]);
    }

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast({ title: '✅ Category updated' });
      router.push('/admin/categories');
      router.refresh();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Update failed',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= LOADING ================= */

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto mt-10">
        <Skeleton className="h-8 w-40 mb-4" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!category) return null;

  const title = isReadOnly ? 'View Category' : 'Edit Category';

  /* ================= UI ================= */

  return (
    <div className="max-w-lg mx-auto mt-10 border rounded-lg bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">
            Category details
          </p>
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => router.push('/admin/categories')}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* BODY */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-5 py-4 space-y-4"
      >
        {/* NAME */}
        <div className="space-y-1">
          <Label>Category Name</Label>
          <Input
            disabled={isReadOnly}
            {...form.register('name')}
          />
        </div>

        {/* IMAGE */}
        <div className="space-y-1">
          <Label>Category Image</Label>

          {previewImage && (
            <div className="relative w-24 h-24 mb-2">
              <Image
                src={previewImage}
                alt="Category image"
                fill
                className="rounded object-cover border"
              />
            </div>
          )}

          {!isReadOnly && (
            <Controller
              control={form.control}
              name="image"
              render={({ field }) => (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    field.onChange(files);
                    if (files?.[0]) {
                      setPreviewImage(
                        URL.createObjectURL(files[0])
                      );
                    }
                  }}
                />
              )}
            />
          )}
        </div>

        {/* SWITCHES */}
        <div className="flex justify-between pt-2">
          <div className="flex items-center gap-2">
            <Label>Active</Label>
            <Switch
              disabled={isReadOnly}
              checked={form.watch('status')}
              onCheckedChange={(v) =>
                form.setValue('status', v)
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <Label>Featured</Label>
            <Switch
              disabled={isReadOnly}
              checked={form.watch('featured')}
              onCheckedChange={(v) =>
                form.setValue('featured', v)
              }
            />
          </div>
        </div>

        {/* FOOTER */}
        {!isReadOnly && (
          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push('/admin/categories')
              }
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
