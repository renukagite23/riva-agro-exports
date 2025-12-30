'use client';

import * as React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

import type { Product, Category } from '@/lib/types';

/* ================= TYPES ================= */

type Props = {
  open: boolean;
  mode: 'add' | 'edit' | 'view';
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
};

/* ================= SCHEMA ================= */

const schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  hsCode: z.string().min(1),
  minOrderQty: z.string().min(1),
  discountedPrice: z.coerce.number(),
  sellingPrice: z.coerce.number(),
  images: z.custom<FileList>().optional(),
  status: z.boolean(),
  featured: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

/* ================= COMPONENT ================= */

export function ProductModal({
  open,
  mode,
  product,
  categories,
  onClose,
  onSaved,
}: Props) {
  const { toast } = useToast();
  const isView = mode === 'view';

  const [selectedImages, setSelectedImages] = React.useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: true,
      featured: false,
      discountedPrice: 0,
      sellingPrice: 0,
    },
  });

  /* ================= PREFILL ================= */

  React.useEffect(() => {
    if (!product) return;

    form.reset({
      name: product.name,
      description: product.description,
      category: product.category,
      hsCode: product.hsCode,
      minOrderQty: product.minOrderQty || '',
      discountedPrice: product.discountedPrice || 0,
      sellingPrice: product.sellingPrice || 0,
      status: product.status === 'active',
      featured: product.featured,
    });

    setImagePreviews(product.images || []);
    setSelectedImages([]);
  }, [product, form]);

  /* ================= IMAGE HANDLING ================= */

  const handleImages = (files: FileList | null) => {
    if (!files || isView) return;

    const newFiles = Array.from(files);

    if (selectedImages.length + newFiles.length > 5) {
      toast({
        variant: 'destructive',
        title: 'Max 5 images allowed',
      });
      return;
    }

    const updated = [...selectedImages, ...newFiles];
    const previews = [
      ...imagePreviews,
      ...newFiles.map((f) => URL.createObjectURL(f)),
    ];

    setSelectedImages(updated);
    setImagePreviews(previews);

    const dt = new DataTransfer();
    updated.forEach((f) => dt.items.add(f));
    form.setValue('images', dt.files);
  };

  const removeImage = (index: number) => {
    if (isView) return;

    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedFiles = selectedImages.filter((_, i) => i !== index);

    setImagePreviews(updatedPreviews);
    setSelectedImages(updatedFiles);

    const dt = new DataTransfer();
    updatedFiles.forEach((f) => dt.items.add(f));
    form.setValue('images', dt.files);
  };

  /* ================= SUBMIT ================= */

  const onSubmit = async (values: FormValues) => {
    if (isView) return;

    const fd = new FormData();

    Object.entries(values).forEach(([k, v]) => {
      if (k === 'images' && v) {
        Array.from(v as FileList).forEach((f) =>
          fd.append('images', f)
        );
      } else if (k === 'status') {
        fd.append('status', v ? 'active' : 'inactive');
      } else {
        fd.append(k, String(v));
      }
    });

    const res = await fetch(
      mode === 'edit'
        ? `/api/products/${product?.id}`
        : '/api/products',
      {
        method: mode === 'edit' ? 'PUT' : 'POST',
        body: fd,
      }
    );

    if (!res.ok) {
      toast({ variant: 'destructive', title: 'Save failed' });
      return;
    }

    toast({ title: 'Product saved' });
    onSaved();
    onClose();
  };

  /* ================= UI ================= */

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="px-5 py-4 border-b">
          <DialogTitle>
            {mode === 'view'
              ? 'Product Details'
              : mode === 'edit'
              ? 'Edit Product'
              : 'Add Product'}
          </DialogTitle>
        </DialogHeader>

        {/* VIEW MODE */}
        {isView && product && (
          <div className="p-5 text-sm space-y-2">
            <div>
              <div className="text-lg font-semibold">
                Product Name : {product.name}
              </div>
              <div className="text-muted-foreground">
                Category : {product.categoryName}
              </div>
            </div>

            <div className="border-t" />

            <div className="grid grid-cols-2 gap-y-3 gap-x-10">
              <Info label="HS Code" value={product.hsCode} />
              <Info label="Slug" value={product.slug} />
              <Info label="Minimum Order Qty" value={product.minOrderQty} />
              <Info label="Selling Price (MRP)" value={`₹${product.sellingPrice}`} />
              <Info label="Discounted Price" value={`₹${product.discountedPrice}`} />
            </div>

            <div className="border-t" />

            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Description
              </div>
              <p>{product.description}</p>
            </div>

            <div className="border-t" />

            <div>
              <div className="text-xs text-muted-foreground mb-2">
                Product Images
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.images.map((img, i) => (
                  <div key={i} className="relative h-16 w-16 border rounded">
                    <Image src={img} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t" />

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Badge>{product.status}</Badge>
                {product.featured && <Badge>Featured</Badge>}
              </div>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}

        {/* ADD / EDIT FORM */}
        {!isView && (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-5 space-y-3 text-sm max-h-[75vh] overflow-y-auto"
          >
            <Label>Product Name</Label>
            <Input {...form.register('name')} />

            <Label>Description</Label>
            <Textarea rows={2} {...form.register('description')} />

            <Label>Category</Label>
            <Select
              value={form.watch('category')}
              onValueChange={(v) => form.setValue('category', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="HS Code" {...form.register('hsCode')} />
              <Input placeholder="MOQ" {...form.register('minOrderQty')} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input type="number" placeholder="Discounted" {...form.register('discountedPrice')} />
              <Input type="number" placeholder="MRP" {...form.register('sellingPrice')} />
            </div>

            <Label>Images (max 5)</Label>
            <Input type="file" multiple onChange={(e) => handleImages(e.target.files)} />

            {imagePreviews.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative h-14 w-14">
                    <img src={src} className="h-14 w-14 rounded border object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-2">
              <div className="flex gap-2 items-center">
                <Label>Active</Label>
                <Switch
                  checked={form.watch('status')}
                  onCheckedChange={(v) => form.setValue('status', v)}
                />
              </div>

              <div className="flex gap-2 items-center">
                <Label>Featured</Label>
                <Switch
                  checked={form.watch('featured')}
                  onCheckedChange={(v) => form.setValue('featured', v)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === 'edit' ? 'Update' : 'Save'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ================= HELPER ================= */

function Info({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value || '-'}</div>
    </div>
  );
}
