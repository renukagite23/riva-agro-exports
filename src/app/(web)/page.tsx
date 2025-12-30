import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Truck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ProductCard } from '@/components/product-card';
import { getCategories } from '@/lib/models/Category';
import { getProducts } from '@/lib/models/Product';
import type { Category, Product } from '@/lib/types';
import HeroSlider from '@/components/hero-slider';
import CategorySlider from "@/components/category-slider";


const promoBanners = [
  {
    id: 1,
    title: "20% Off on Sandal Cream",
    description:
      "Crafted from authentic sandalwood for deep nourishment and natural radiance..",
    buttonText: "CHECK OUT",
    image: "/uploads/banners/promo-1.jpg",
    link: "/products",
  },
  {
    id: 2,
    title: "Grand Naine Fresh Bananas",
    description:
      "Carefully grown and harvested to deliver natural sweetness and consistent quality.",
    buttonText: "SHOP NOW",
    image: "/uploads/banners/promo-2.jpg",
    link: "/products",
  },
  {
    id: 3,
    title: "Premium Red Onions",
    description:
      "Carefully selected for strong flavor, long shelf life, and export-grade quality.",
    buttonText: "CHECK OUT",
    image: "/uploads/banners/promo-3.jpg",
    link: "/products",
  },
];


async function getData() {
    try {
        const [categories, products] = await Promise.all([
            getCategories(),
            getProducts()
        ]);
        return { categories, products };
    } catch (error) {
        console.error("Failed to fetch data, falling back to mock data.", error);
        // Fallback to empty arrays in case of DB error
        return { categories: [], products: [] };
    }
}


export default async function HomePage() {
  const heroImage = { imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxhZ3JpY3VsdHVyZSUyMGZpZWxkfGVufDB8fHx8MTc2NTgxMzQ2NXww&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "agriculture field" };
  const aboutImage = { imageUrl: "https://images.unsplash.com/photo-1659021245220-8cf62b36fe25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxmYXJtZXJzJTIwd29ya2luZ3xlbnwwfHx8fDE3NjU4NjQwNTN8MA&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "farmers working" };

  const { categories, products } = await getData();

const featuredProducts = products
  .filter((p) => p.featured && p.status === 'active')
  .slice(0, 8);  const featuredCategories = categories.filter(c => c.featured && c.status === 'active');
  



  return (
    <div className="flex flex-col">
      {/* Hero Section */}
    {/* Hero Slider Section */}
 <HeroSlider />

       

      {/* Featured Categories */}
    
{featuredCategories.length > 0 && (
  <CategorySlider featuredCategories={featuredCategories} />
)}

<section className="pt-8 pb-20 bg-white">
  <div className="container">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {promoBanners.map((item) => (
        <Link
          key={item.id}
          href={item.link}
          className="group relative h-[420px] overflow-hidden"
        >
          {/* Background Image */}
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
            <h3 className="text-xl font-semibold leading-tight">
              {item.title}
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-white/90">
              {item.description}
            </p>

            <span className="mt-6 inline-block w-fit bg-white px-8 py-3 text-sm font-semibold tracking-wide text-black transition group-hover:bg-black group-hover:text-white">
              {item.buttonText}
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>


    {/* Featured Products */}
<section className="py-20 bg-secondary">
  <div className="container">

    {/* Section Heading */}
    <h2 className="text-center font-headline text-4xl font-bold tracking-tight">
      Featured Products
    </h2>

    {/* Products Grid */}
  <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
  {featuredProducts.map((product, index) => {
const sellingPrice = product.sellingPrice ;
const discountedPrice = product.discountedPrice;
    return (
      <div
        key={`${product._id?.toString() ?? product.slug}-${index}`}
      >
        <Link
          href={`/products/${product.slug}`}
          className="group block"
        >
          <div
            className="
              bg-white rounded-2xl
              shadow-sm
              transition-all duration-300
              hover:shadow-xl hover:-translate-y-1
            "
          >
            {/* Image */}
          <div className="relative aspect-[4/5] bg-gray-50 rounded-t-xl overflow-hidden group">
  <Image
    src={
      product.primaryImage ||
      product.images?.[0] ||
      "/uploads/default-product.jpg"
    }
    alt={product.name}
    fill
    sizes="(max-width: 768px) 100vw, 25vw"
    className="
      object-contain p-6
      transition-all duration-300
      group-hover:scale-105 group-hover:opacity-80
    "
  />

  {/* Featured badge */}
  {product.featured && (
    <span className="absolute top-4 left-4 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white shadow-md z-10">
      Featured
    </span>
  )}
   <div
    className="
      absolute inset-0
      flex items-center justify-center
      bg-black/40
      opacity-0
      transition-opacity duration-300
      group-hover:opacity-100
    "
  >
    <span
      className="
        rounded-full bg-white px-6 py-2
        text-sm font-semibold text-gray-900
        shadow-lg
      "
    >
      View Product
    </span>
  </div>

  
</div> 
{/* Content */}
<div className="p-5 text-left space-y-1">
  {/* Product Name */}
  <h3 className="text-base font-semibold text-gray-900">
    {product.name}
  </h3>

  {/* Category */}
  {product.categoryName && (
    <p className="text-sm text-gray-500">
      {product.categoryName}
    </p>
  )}

  {/* Price */}
  <div className="pt-2 space-y-0.5">
    <div className="flex items-center justify-left gap-2">
      {/* Final Price */}
       <span className="text-sm text-gray-400 line-through">
          ₹{sellingPrice}
        </span>
      <span className="text-lg font-bold text-gray-900">
        ₹{discountedPrice}
      </span>

      {/* MRP (only if discounted) */}
       
    </div>

    {/* MOQ */}
    {product.minOrderQty && (
<span className="inline-block mt-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
    MOQ: <span className="font-medium">{product.minOrderQty} </span>
  </span>
    )}
  </div>
</div>



</div>
  </Link>
      </div>
    );
  })}
</div>
</div>

{/* All Products Button */}
<div className="mt-14 flex justify-center">
  <Link href="/products">
    <Button
      size="lg"
      className="rounded-full px-10 py-6 text-base font-semibold"
      variant="outline"
    >
      All Products
    </Button>
  </Link>
</div> 


</section>


{/* ================= Sandal Pure Feature Section ================= */}

<section className="relative bg-[#020001] overflow-hidden">
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr]">

    {/* LEFT — Text (container constrained) */}
<div className="px-6 lg:px-16 py-20 flex items-center max-w-xl">
      <div>
        <span className="inline-block rounded-full bg-[#caa24d]/20 px-5 py-2 text-sm font-semibold text-[#e6c77a]">
          Featured Brand
        </span>

        <h2 className="mt-6 font-headline text-4xl md:text-5xl font-bold
          bg-gradient-to-r from-[#f5d88c] via-[#e6b65c] to-[#caa24d]
          bg-clip-text text-transparent">
          Sandal Pure
        </h2>

        <p className="mt-4 text-lg max-w-lg text-[#e7dbc6]">
          A premium range of 100% sandalwood-based herbal creams,
          cultivated, processed, and delivered directly by sandalwood farmers.
        </p>

        <div className="mt-8 flex gap-4">
          <Button className="bg-gradient-to-r from-[#f5d88c] to-[#caa24d] text-black">
            Explore Sandal Pure
          </Button>
        </div>
      </div>
    </div>

    {/* RIGHT — Image (FULL WIDTH to edge) */}
   <div className="relative min-h-[520px] lg:min-h-[600px] overflow-hidden">
  <Image
    src="/uploads/banners/banner-6.png"
    alt="Sandal Pure Product Range"
    fill
    priority
    className="object-cover object-left"
  />
</div>

  </div>
</section>

<section className="py-24 bg-white">
  <div className="container">

    {/* Header */}
    <div className="text-center max-w-3xl mx-auto">
      <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
        How We Work
      </span>
      <h2 className="mt-4 font-headline text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
        From Farm to Global Delivery
      </h2>
      <p className="mt-4 text-lg text-muted-foreground">
        Our export process ensures freshness, quality, and reliability
        at every stage of the supply chain.
      </p>
    </div>

    {/* Timeline */}
    <div className="relative mt-24">

      {/* Connector Line */}
      <div className="absolute left-0 right-0 top-8 hidden lg:block h-1 bg-primary/20" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">

       {[
  {
    title: "Own Farm Cultivation",
    desc: "Produce grown on our own farms using best agricultural practices.",
  },
  {
    title: "Crop Monitoring & Harvest",
    desc: "Careful monitoring and timely harvesting for optimal quality.",
  },
  {
    title: "Quality Grading",
    desc: "Strict grading and sorting to meet export standards.",
  },
  {
    title: "Processing & Packaging",
    desc: "Hygienic processing and secure packaging to retain freshness.",
  },
  {
    title: "Global Export",
    desc: "Complete export handling and timely delivery worldwide.",
  },
].map((step, index) => (

          <div
            key={index}
            className="relative text-center"
          >
            {/* Step Circle */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-xl font-bold shadow-lg">
              {index + 1}
            </div>

            {/* Content */}
            <h3 className="mt-6 text-xl font-bold text-gray-900">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>

  </div>
</section>


<section className="pt-10 pb-24 bg-white">
  <div className="container">

    {/* Header */}
    <div className="text-center max-w-3xl mx-auto">
    <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
        Testimonials
      </span>
        <h2 className="text-center font-headline text-4xl font-bold tracking-tight">
        Trusted by Global Buyers    
          </h2>
      <p className="mt-4 text-lg text-muted-foreground">
        What our clients say about working with Riva Agro Exports.
      </p>
    </div>

    {/* Horizontal Reviews */}
    <div className="mt-20">
      <Carousel
        opts={{ align: "start", loop: true }}
        className="relative w-full overflow-x-clip"
      >

        <div className="overflow-hidden">

        <CarouselContent>

          {[
            {
              review:
                "Riva Agro Exports’ own farming model ensures consistent quality and transparency throughout the export process.",
              name: "Ahmed Al Noor",
              meta: "FreshMart Trading LLC · UAE",
            },
            {
              review:
                "Excellent grading standards and reliable delivery schedules. A professional export partner.",
              name: "Daniel Thompson",
              meta: "Global Food Imports · UK",
            },
            {
              review:
                "Complete control from cultivation to export makes them stand apart from traders.",
              name: "Rahul Mehta",
              meta: "AgroWorld Distributors · India",
            },
            {
              review:
                "Consistent quality, hygienic packaging, and timely shipments across markets.",
              name: "Khalid Hassan",
              meta: "Middle East Produce Co. · Qatar",
            },
          ].map((item, index) => (
            <CarouselItem
              key={index}
              className="basis-[85%] sm:basis-1/2 lg:basis-1/3"

            >
              <div className="h-full rounded-2xl border border-gray-200 p-8">

                {/* Stars */}
                <div className="flex gap-1 text-yellow-400 text-sm">
                  ★★★★★
                </div>

                {/* Review */}
                <p className="mt-4 text-base leading-relaxed text-gray-700">
                  “{item.review}”
                </p>

                {/* Client */}
                <div className="mt-6">
                  <p className="font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.meta}
                  </p>
                </div>

              </div>
            </CarouselItem>
          ))}

        </CarouselContent>
      </div>
<CarouselPrevious className="left-4 max-w-full" />
<CarouselNext className="right-4 max-w-full" />
      </Carousel>
    </div>

  </div>
</section>




  
     {/* About Us Section */}
{/* <section className="relative py-24 bg-background overflow-hidden">
  {/* Decorative Background */}
  {/* <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />

  <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      */}
    {/* Image Side */}
    {/* <div className="relative">
      <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
        <Image
          src={aboutImage.imageUrl}
          alt="About Riva Agro Exports"
          fill
          className="object-cover"
          data-ai-hint={aboutImage.imageHint}
        />
      </div>
    </div> */}

    {/* Content Side */}
    {/* <div className="space-y-8">
      <div>
        <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
          About Us
        </span>
        <h2 className="mt-4 font-headline text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          Trusted Agro Exports,<br className="hidden sm:block" />
          From Indian Farms to the World
        </h2>
      </div>

      <p className="text-lg leading-relaxed text-muted-foreground">
        At <span className="font-semibold text-gray-900">Riva Agro Exports</span>, we bridge the gap
        between local farmers and global markets. With years of expertise in sourcing,
        quality assurance, and international trade, we export premium agricultural
        products that meet global standards.
      </p> */}

      {/* Highlights */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h4 className="text-2xl font-bold text-primary">10+</h4>
          <p className="mt-1 text-sm text-muted-foreground">Years Experience</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h4 className="text-2xl font-bold text-primary">25+</h4>
          <p className="mt-1 text-sm text-muted-foreground">Export Countries</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h4 className="text-2xl font-bold text-primary">100%</h4>
          <p className="mt-1 text-sm text-muted-foreground">Quality Assured</p>
        </div>
      </div> */}

      {/* CTA */}
      {/* <div className="flex items-center gap-6">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/about">Learn More</Link>
        </Button>
        <Link
          href="/contact"
          className="text-base font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
        >
          Contact Us →
        </Link>
      </div>
    </div>
  </div>
</section> */}



      {/* Why Choose Us Section */}
{/* Why Choose Us – Alternate Design */}
<section className="relative py-24 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 overflow-hidden">
  {/* Background Accent */}
  <div className="absolute inset-y-0 right-0 w-1/2 bg-primary/5 -z-10 rounded-l-[120px]" />

  <div className="container grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

    {/* Left Content */}
    <div>
      <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
        Why Choose Us
      </span>

      <h2 className="mt-6 font-headline text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
        Built on Trust,<br />
        Powered by Agriculture
      </h2>

      <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
        We don’t just export products — we build long-term partnerships by
        delivering consistent quality, reliable logistics, and certified
        agricultural exports across global markets.
      </p>

      {/* Divider */}
      <div className="mt-10 h-1 w-20 rounded-full bg-primary" />
    </div>

    {/* Right Features */}
    <div className="space-y-10">

      {/* Item 1 */}
      <div className="flex gap-6 items-start">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
          <Leaf className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Farm-Fresh Quality
          </h3>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Direct sourcing from trusted farmers ensures freshness,
            traceability, and premium quality in every shipment.
          </p>
        </div>
      </div>

      {/* Item 2 */}
      <div className="flex gap-6 items-start">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
          <Truck className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Global Supply Chain
          </h3>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Our logistics network guarantees timely, secure delivery to
            international destinations with minimal handling.
          </p>
        </div>
      </div>

      {/* Item 3 */}
      <div className="flex gap-6 items-start">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Certified & Compliant
          </h3>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Fully compliant with international export standards,
            certifications, and quality regulations.
          </p>
        </div>
      </div>

    </div>
  </div>
</section>


    </div>
  );
}