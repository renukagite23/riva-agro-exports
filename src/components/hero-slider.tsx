"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";



const heroSlides = [
  {
    imageUrl:
     // "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1600&q=80",
   //  "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1800&q=80",
     "/uploads/banners/banner-1.png",
    heading: "Freshness Delivered, Globally.",
    subheading: "Sourcing the highest quality agricultural products for you.",
    textAlign: "right",
  },
  {
    imageUrl:
     // "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80",
    // "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2400&q=80",
    "/uploads/banners/banner-2.png",
    heading: "From Farm to World",
    subheading: "Connecting farmers to international markets.",
    textAlign: "right",
  },
  
   {
    imageUrl:
    //  "https://images.unsplash.com/photo-1598514982205-f8c97b6d98a7?auto=format&fit=crop&w=1600&q=80",
//"https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=2400&q=80",  
"/uploads/banners/banner-4.png",
  heading: "Trusted Agro Export Partner",
    subheading: "Quality, reliability, and global reach.",
    textAlign: "left",
  },
    {
    imageUrl:
    // "https://images.unsplash.com/photo-1598514982205-f8c97b6d98a7?auto=format&fit=crop&w=1600&q=80",
//"https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=2400&q=80",  
"/uploads/banners/banner-7.png",
  heading: "Pure Sandalwood. Pure Skincare.",
   subheading: "Natural, and herbal products made from sandalwood.",
    textAlign: "right",
  },
];

export default function HeroSlider() {
     const autoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    })
  );

 
  return (
    <section className="relative h-[70vh] w-full overflow-hidden text-white">
      <Carousel
        opts={{ loop: true }}
        plugins={[autoplay.current]}
        className="relative w-full overflow-x-clip"
      >
        <div className="overflow-hidden">

        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="relative h-[70vh] w-full">
              <Image
                src={slide.imageUrl}
                alt={slide.heading}
                fill
                priority={index === 0}
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/50 z-10" />
<div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40 z-10" />

            <div
  className={`
    relative z-20 flex h-full items-center px-8 md:px-16
    ${slide.textAlign === "left" ? "justify-start text-left" : "justify-end text-right"}
  `}
>
  <div
  className={`
    max-w-xl animate-[fadeUp_0.8s_ease-out]
    ${slide.textAlign === "left" ? "text-left" : "text-right"}
  `}
>
  <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight">
    {slide.heading}
  </h1>

  <p className="mt-5 text-lg md:text-xl text-white/90">
    {slide.subheading}
  </p>

  <div
    className={`
      mt-8 flex flex-wrap gap-4
      ${slide.textAlign === "left" ? "justify-start" : "justify-end"}
    `}
  >
    {/* Primary CTA */}
    <Button
      asChild
      size="lg"
      className="bg-[#d4af37] text-black hover:bg-[#c9a227]"
    >
      <Link href="/contact">Get a Quote</Link>
    </Button>

    {/* Secondary CTA */}
    <Button
      asChild
      size="lg"
      variant="outline"
      className="
        border-[#d4af37] text-[#d4af37]
        hover:bg-[#d4af37] hover:text-black
      "
    >
      <Link href="/products">Find More</Link>
    </Button>
  </div>
</div>

</div>
            </CarouselItem>
          ))}
        </CarouselContent>
</div>
<CarouselPrevious
  className="
    left-4
    opacity-100
    pointer-events-auto
    bg-white/90
    hover:bg-white
    text-black
    shadow-lg
  "
/>

<CarouselNext
  className="
    right-4
    opacity-100
    pointer-events-auto
    bg-white/90
    hover:bg-white
    text-black
    shadow-lg
  "
/>
      </Carousel>
    </section>
  );
}