
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Category } from "@/lib/types";
import Image from "next/image";

interface CategoryDetailsModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryDetailsModal({ category, isOpen, onClose }: CategoryDetailsModalProps) {
  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Category Details</DialogTitle>
          <DialogDescription>
            Viewing details for category: {category.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
            <div className="relative w-full h-48 rounded-md overflow-hidden">
                <Image src={category.image} alt={category.name} fill className="object-cover" />
            </div>
             <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
                 <div>
                    <h3 className="font-semibold">Category Name</h3>
                    <p className="text-muted-foreground">{category.name}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Slug</h3>
                    <p className="text-muted-foreground">{category.slug}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Status</h3>
                    <Badge variant={category.status === 'active' ? 'default' : 'outline'}>{category.status}</Badge>
                </div>
                <div>
                    <h3 className="font-semibold">Featured</h3>
                    <Badge variant={category.featured ? 'secondary' : 'outline'}>{category.featured ? 'Yes' : 'No'}</Badge>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
