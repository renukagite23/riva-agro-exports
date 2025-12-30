"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
};

export default function CategorySlider({
  featuredCategories,
}: {
  featuredCategories: Category[];
}) {
  const autoplay = useRef(
    Autoplay({
      delay: 2500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  return (
    // ✅ CLIP HERE — NOT INSIDE CAROUSEL
    <section className="py-20 bg-white overflow-x-hidden">
      <div className="container">
        <h2 className="text-center font-headline text-4xl font-bold tracking-tight">
          Featured Categories
        </h2>

        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[autoplay.current]}
          className="relative mt-14 bg-white overflow-x-clip"
        >
            <div className="overflow-hidden">
          <CarouselContent>
            {featuredCategories.map((category) => (
              <CarouselItem
                key={category.id}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group flex flex-col items-center perspective-[1000px]"
                >
                  <div
                    className="
                      relative h-44 w-44 md:h-48 md:w-48
                      transition-transform duration-500
                      group-hover:rotate-y-6
                      group-hover:-rotate-x-3
                      group-hover:scale-105
                      transform-gpu
                    "
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-110"
                      sizes="192px"
                    />
                  </div>

                  <span className="mt-4 text-center text-base font-semibold">
                    {category.name}
                  </span>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          </div>

<CarouselPrevious className="left-4 max-w-full" />
<CarouselNext className="right-4 max-w-full" />
        </Carousel>
      </div>
    </section>
  );
}
