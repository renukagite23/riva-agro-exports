"use client";

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  imageIds: string[];
  productName: string;
}

export function ProductImageGallery({ imageIds, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(imageIds[0]);

  if (!imageIds || imageIds.length === 0) {
    // Render a placeholder if no images are available
    return (
       <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-md">
          <Image
            src="https://picsum.photos/seed/placeholder/600/600"
            alt="Placeholder image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 80vw, 40vw"
            priority
          />
        </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      <div className="flex md:flex-col gap-2">
        {imageIds.map(image => (
          <button
            key={image}
            onClick={() => setSelectedImage(image)}
            className={cn(
              "relative h-16 w-16 rounded-md overflow-hidden ring-2 ring-transparent transition",
              selectedImage === image ? "ring-primary" : "hover:ring-primary/50"
            )}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 10vw, 5vw"
            />
          </button>
        ))}
      </div>
      <div className="flex-1">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-md">
          <Image
            src={selectedImage}
            alt={productName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 80vw, 40vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}
