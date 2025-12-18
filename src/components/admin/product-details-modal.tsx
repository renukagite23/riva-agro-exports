
"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/lib/types";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>
            Viewing product details.
          </DialogDescription>
        </DialogHeader>
        
        <Carousel className="w-full">
          <CarouselContent>
            {product.images.map((img, index) => (
              <CarouselItem key={index}>
                <div className="relative h-64 w-full">
                  <Image src={img} alt={`${product.name} image ${index + 1}`} fill className="object-contain rounded-md" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div className="space-y-4">
            <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>
            <Separator />
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <h3 className="font-semibold">Category</h3>
                    <p className="text-muted-foreground capitalize">{product.category}</p>
                </div>
                 <div>
                    <h3 className="font-semibold">HS Code</h3>
                    <p className="text-muted-foreground">{product.hsCode}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Status</h3>
                    <Badge variant={product.status === 'active' ? 'default' : 'outline'}>{product.status}</Badge>
                </div>
                <div>
                    <h3 className="font-semibold">Featured</h3>
                    <Badge variant={product.featured ? 'secondary' : 'outline'}>{product.featured ? 'Yes' : 'No'}</Badge>
                </div>
             </div>
             <Separator />
             <div>
                <h3 className="font-semibold">Variants</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {product.variants.map((variant) => (
                            <TableRow key={variant.id}>
                                <TableCell>{variant.name}</TableCell>
                                <TableCell className="text-right">₹{variant.price.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
