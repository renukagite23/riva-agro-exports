'use client';

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
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/* ================= TYPES ================= */

type Category = {
  id: string;
  name: string;
};

type ImportProduct = {
  _id: string;
  categoryId: string;
  categoryName: string;
  productName: string;
  totalQuantity: number;
  purchasePrice: number;
  shippingCost: number;
  taxAmount: number;
  images: string[];
};

type Props = {
  open: boolean;
  mode: 'add' | 'edit' | 'view';
  data?: ImportProduct | null;
  onClose: () => void;
  onSaved: () => void;
};

/* ================= COMPONENT ================= */

export function ImportProductModal({
  open,
  mode,
  data,
  onClose,
  onSaved,
}: Props) {
  const { toast } = useToast();
  const isView = mode === 'view';

  /* ================= STATE ================= */

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [form, setForm] = React.useState({
    categoryId: '',
    productName: '',
    totalQuantity: '',
    purchasePrice: '',
    shippingCost: '',
    taxAmount: '',
  });

  const [existingImages, setExistingImages] = React.useState<string[]>([]);
  const [newImages, setNewImages] = React.useState<File[]>([]);
  const [newPreviews, setNewPreviews] = React.useState<string[]>([]);

  /* ================= FETCH CATEGORIES ================= */

  React.useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  /* ================= PREFILL ================= */

  React.useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && data) {
      setForm({
        categoryId: data.categoryId,
        productName: data.productName,
        totalQuantity: String(data.totalQuantity),
        purchasePrice: String(data.purchasePrice),
        shippingCost: String(data.shippingCost),
        taxAmount: String(data.taxAmount),
      });

      setExistingImages(data.images || []);
      setNewImages([]);
      setNewPreviews([]);
    }
  }, [mode, data]);

  /* ================= IMAGE HANDLERS ================= */

  const handleNewImages = (files: FileList | null) => {
    if (!files || isView) return;

    const arr = Array.from(files);
    setNewImages((p) => [...p, ...arr]);
    setNewPreviews((p) => [
      ...p,
      ...arr.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((p) => p.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewImages((p) => p.filter((_, i) => i !== index));
    setNewPreviews((p) => p.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT (FIXED) ================= */

  const handleSubmit = async () => {
    const fd = new FormData();

    if (mode === 'edit' && data?._id) {
      fd.append('id', data._id);
    }

    fd.append('categoryId', form.categoryId);
    fd.append('productName', form.productName);
    fd.append('totalQuantity', form.totalQuantity);
    fd.append('purchasePrice', form.purchasePrice);
    fd.append('shippingCost', form.shippingCost);
    fd.append('taxAmount', form.taxAmount);

    /**
     * ✅ FIX:
     * Always send existingImages — even if empty
     */
    fd.append(
      'existingImages',
      JSON.stringify(existingImages)
    );

    newImages.forEach((file) => {
      fd.append('images', file);
    });

    const res = await fetch('/api/import-products', {
      method: mode === 'edit' ? 'PUT' : 'POST',
      body: fd,
    });

    if (!res.ok) {
      toast({
        variant: 'destructive',
        title: 'Save failed',
      });
      return;
    }

    toast({
      title: mode === 'edit' ? 'Updated' : 'Saved',
    });

    onSaved();
    onClose();
  };

  /* ================= UI (UNCHANGED) ================= */

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="px-5 py-4 border-b">
          <DialogTitle>
            {mode === 'view'
              ? 'Import Product Details'
              : mode === 'edit'
              ? 'Edit Import'
              : 'Import Product'}
          </DialogTitle>
        </DialogHeader>

        {/* VIEW MODE */}
        {isView && data && (
          <div className="px-6 py-5 space-y-4 text-sm">
            <div className="grid grid-cols-[140px_1fr] gap-y-2">
              <span className="text-muted-foreground">Category</span>
              <span>: {data.categoryName}</span>

              <span className="text-muted-foreground">Product Name</span>
              <span>: {data.productName}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-2">
              <div>
                <span className="text-muted-foreground">Quantity</span>
                <span className="ml-2">: {data.totalQuantity}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Purchase Price</span>
                <span className="ml-2">: ₹{data.purchasePrice}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Shipping Cost</span>
                <span className="ml-2">: ₹{data.shippingCost}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Tax Amount</span>
                <span className="ml-2">: ₹{data.taxAmount}</span>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground mb-2">Images :</p>
              <div className="flex gap-2">
                {data.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="h-16 w-16 rounded border object-cover"
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}

        {/* ADD / EDIT MODE */}
        {!isView && (
          <div className="px-5 py-4 space-y-3 max-h-[75vh] overflow-y-auto">
            {/* CATEGORY */}
            <div>
              <Label>Category</Label>
              <select
                className="w-full rounded-md border px-3 py-2"
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PRODUCT */}
            <div>
              <Label>Product Name</Label>
              <Input
                value={form.productName}
                onChange={(e) =>
                  setForm({ ...form, productName: e.target.value })
                }
              />
            </div>

            {[
              ['Total Quantity', 'totalQuantity'],
              ['Purchase Price', 'purchasePrice'],
              ['Shipping Cost', 'shippingCost'],
              ['Tax Amount', 'taxAmount'],
            ].map(([label, key]) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  type="number"
                  value={(form as any)[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                />
              </div>
            ))}

            {/* IMAGES */}
            <div>
              <Label>Images</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleNewImages(e.target.files)}
              />

              <div className="flex gap-2 mt-2 flex-wrap">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      className="h-16 w-16 rounded border object-cover"
                    />
                    <button
                      onClick={() => removeExistingImage(i)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white h-4 w-4 rounded-full flex items-center justify-center"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}

                {newPreviews.map((src, i) => (
                  <div key={i} className="relative">
                    <img
                      src={src}
                      className="h-16 w-16 rounded border object-cover"
                    />
                    <button
                      onClick={() => removeNewImage(i)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white h-4 w-4 rounded-full flex items-center justify-center"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {mode === 'edit' ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
