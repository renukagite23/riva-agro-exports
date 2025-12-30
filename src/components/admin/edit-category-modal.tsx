'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';

const schema = z.object({
  name: z.string().min(1),
  image: z.any().optional(),
  status: z.boolean(),
  featured: z.boolean(),
});

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  categoryId: string | null;
  readOnly?: boolean;
  refresh: () => void;
};

export default function EditCategoryModal({
  open,
  setOpen,
  categoryId,
  readOnly = false,
  refresh,
}: Props) {
  const { toast } = useToast();
  const [preview, setPreview] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      status: true,
      featured: false,
    },
  });

  /* Fetch category */
  React.useEffect(() => {
    if (!open || !categoryId) return;

    (async () => {
      const res = await fetch(`/api/categories/${categoryId}`);
      const data: Category = await res.json();

      form.reset({
        name: data.name,
        status: data.status === 'active',
        featured: data.featured,
      });

      setPreview(data.image ?? null);
    })();
  }, [open, categoryId]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (readOnly || !categoryId) return;

    const fd = new FormData();
    fd.append('name', values.name);
    fd.append('status', values.status ? 'active' : 'inactive');
    fd.append('featured', String(values.featured));
    if (values.image?.[0]) fd.append('image', values.image[0]);

    const res = await fetch(`/api/categories/${categoryId}`, {
      method: 'PUT',
      body: fd,
    });

    if (!res.ok) {
      toast({ variant: 'destructive', title: 'Update failed' });
      return;
    }

    toast({ title: 'Category updated' });
    setOpen(false);
    refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="px-5 py-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle>
                {readOnly ? 'View Category' : 'Edit Category'}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Category details
              </p>
            </div>
            {/* <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-5 py-4 space-y-4"
        >
          <div>
            <Label>Name</Label>
            <Input disabled={readOnly} {...form.register('name')} />
          </div>

          <div>
            <Label>Image</Label>
            {!readOnly && (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files;
                  form.setValue('image', f);
                  if (f?.[0]) setPreview(URL.createObjectURL(f[0]));
                }}
              />
            )}

            {preview && (
              <img
                src={preview}
                className="h-24 w-24 mt-2 rounded border object-cover"
              />
            )}
          </div>

          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Label>Active</Label>
              <Switch
                disabled={readOnly}
                checked={form.watch('status')}
                onCheckedChange={(v) => form.setValue('status', v)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Label>Featured</Label>
              <Switch
                disabled={readOnly}
                checked={form.watch('featured')}
                onCheckedChange={(v) => form.setValue('featured', v)}
              />
            </div>
          </div>

          {!readOnly && (
            <div className="flex justify-end gap-2 pt-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
