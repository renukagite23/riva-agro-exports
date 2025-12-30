'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import * as React from 'react';

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

/* ================= SCHEMA ================= */

const schema = z.object({
  name: z.string().min(1, 'Category name is required'),
  image: z.any().optional(),
  status: z.boolean(),
  featured: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  refresh: () => void;
};

/* ================= COMPONENT ================= */

export default function AddCategoryModal({
  open,
  setOpen,
  refresh,
}: Props) {
  const { toast } = useToast();
  const [preview, setPreview] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      status: true,
      featured: false,
    },
  });

  /* ================= IMAGE HANDLER ================= */

  const handleImage = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    form.setValue('image', files);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setPreview(null);
    form.setValue('image', undefined);
  };

  /* ================= SUBMIT ================= */

  const onSubmit = async (values: FormValues) => {
    const fd = new FormData();
    fd.append('name', values.name);
    fd.append('status', values.status ? 'active' : 'inactive');
    fd.append('featured', String(values.featured));

    if (values.image?.[0]) {
      fd.append('image', values.image[0]);
    }

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) throw new Error();

      toast({ title: '✅ Category created' });

      form.reset();
      setPreview(null);
      setOpen(false);
      refresh();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Failed to create category',
      });
    }
  };

  /* ================= UI ================= */

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg p-0">
        
        {/* HEADER */}
        <DialogHeader className="px-5 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Add New Category</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Enter category details
              </p>
            </div>

            {/* SINGLE CLOSE ICON */}
            {/* <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </DialogHeader>

        {/* BODY */}
        <div className="px-5 py-4">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* CATEGORY NAME */}
            <div className="space-y-1">
              <Label>Category Name</Label>
              <Input
                className="py-2"
                {...form.register('name')}
              />
              {form.formState.errors.name?.message && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* IMAGE */}
            <div className="space-y-1">
              <Label>Category Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImage(e.target.files)
                }
              />

              {preview && (
                <div className="mt-2 relative w-24">
                  <img
                    src={preview}
                    className="h-24 w-24 rounded border object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* SWITCHES */}
            <div className="flex justify-between pt-2">
              <div className="flex items-center gap-2">
                <Label>Active</Label>
                <Switch
                  checked={form.watch('status')}
                  onCheckedChange={(v) =>
                    form.setValue('status', v)
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <Label>Featured</Label>
                <Switch
                  checked={form.watch('featured')}
                  onCheckedChange={(v) =>
                    form.setValue('featured', v)
                  }
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-2 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setPreview(null);
                  setOpen(false);
                }}
              >
                Cancel
              </Button>

              <Button type="submit">
                Save
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
