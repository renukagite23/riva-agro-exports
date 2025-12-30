// src/app/sandal-pure/page.tsx
import { Metadata } from "next";
import { getProducts } from "@/lib/models/Product";
import Link from "next/link";



export const metadata: Metadata = {
  title: "Sandal Pure™ | Premium Sandalwood Skincare Products Exporter",
  description:
    "Sandal Pure™ is a premium Indian sandalwood skincare brand offering herbal creams made from 100% pure sandalwood. Manufacturer & exporter of natural skincare products.",
  keywords: [
    "sandalwood skincare",
    "sandalwood cream exporter",
    "herbal skincare products India",
    "sandalwood cosmetic manufacturer",
    "natural skincare export",
    "Sandal Pure",
  ],
  openGraph: {
    title: "Sandal Pure™ | Luxury Sandalwood Skincare",
    description:
      "Explore Sandal Pure’s complete range of sandalwood-based herbal skincare creams, crafted by sandalwood farmers for global markets.",
    type: "website",
  },
};


import Image from "next/image";

export default async function SandalPurePage() {

  const products = await getProducts();
  const SANDAL_PURE_CATEGORY_ID = "6948e0b8005ecdc6599ba47c";

/* Filter Sandal Pure products */
const sandalPureProducts = products.filter(
  (p) =>
    p.status === "active" &&
    (
      p.category?.toString?.() === SANDAL_PURE_CATEGORY_ID ||
      p.category === SANDAL_PURE_CATEGORY_ID
    )
);

  return (
    <main className="bg-white">
<section className="relative w-full h-[550px] overflow-hidden bg-black mb-20">
  <Image
    src="/uploads/banners/sandal-pure.png"
    alt="Hero Banner"
    fill
    priority
    className="object-cover object-center"
  />
</section>
 
<section className="w-full bg-[#ffffff] py-18">
  <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16
                  grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

    {/* LEFT — FULL IMAGE */}
    <div className="relative w-full h-[460px] rounded-3xl overflow-hidden">
      <img
        src="/uploads/sandal-powder-bowl.png"
        alt="Indian Sandalwood Heritage"
        className="w-full h-full object-cover"
      />
    </div>

    {/* RIGHT — STORY TEXT */}
    <div className="max-w-xl">
      <p className="text-sm tracking-widest text-[#9c7c2e] uppercase">
        About Sandal Pure
      </p>

      <h2 className="mt-6 text-3xl md:text-4xl font-semibold text-[#1c1c1c] leading-tight">
        Crafted by the Farmers of{" "}
        <span className="text-[#b89b3f]">Pure Indian Sandalwood</span>
      </h2>

      <div className="mt-8 text-gray-700 leading-relaxed space-y-5">
        <p>
          Sandal Pure is a brand created by the farmers of sandalwood.
        </p>

        <p>
          All our products are made from{" "}
          <strong>100% sandalwood</strong> — pure, natural, and effective.
        </p>

        <p>
          The uniqueness of our products lies in the fact that they are{" "}
          <strong>precious and pure</strong>, yet offered at very affordable
          prices.
        </p>

        <p>
          Because — we cultivate, we produce, and we ourselves bring it
          directly to you.
        </p>
      </div>
    </div>

  </div>
</section>

{/* ================= Sandal Pure Products ================= */}
{/* ================= Sandal Pure Products (Home Grid Style) ================= */}
<section className="py-24 bg-[#ffffff]">
  <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

    {/* Header */}
    <div className="text-center max-w-3xl mx-auto">
      <p className="text-sm tracking-widest uppercase text-[#9c2f2f]">
        Sandal Pure Collection
      </p>

      <h2 className="mt-4 font-headline text-4xl md:text-5xl font-bold text-[#2b0f0f]">
        Sandalwood Skincare Products
      </h2>

      <p className="mt-4 text-lg text-[#5f3a3a]">
        100% Herbal • Farmer Crafted • Export Quality
      </p>
    </div>

    {/* Products Grid */}
    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">

      {sandalPureProducts.map((product, index) => {
        const sellingPrice = product.sellingPrice;
        const discountedPrice = product.discountedPrice;

        return (
          <div
            key={`${product.slug}-${index}`}
            className="
              group bg-white rounded-2xl
              shadow-sm
              transition-all duration-300
              hover:shadow-xl hover:-translate-y-1
            "
          >
            <Link href={`/products/${product.slug}`} className="block">

              {/* Image */}
              <div className="relative aspect-[4/5] bg-gray-50 rounded-t-xl overflow-hidden">
                <Image
                  src={
                    product.primaryImage ||
                    product.images?.[0] ||
                    "/uploads/default-product.jpg"
                  }
                  alt={product.name}
                  fill
                  className="
                    object-contain
                    transition-all duration-300
                    group-hover:scale-105 group-hover:opacity-90
                  "
                />

                {/* Hover Overlay */}
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
                <h3 className="text-sm font-semibold text-gray-900">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    {sellingPrice && discountedPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{sellingPrice}
                      </span>
                    )}
                    <span className="text-base font-bold text-gray-900">
                      ₹{discountedPrice ?? sellingPrice}
                    </span>
                  </div>

                  {/* MOQ */}
                  {product.minOrderQty && (
                    <span className="inline-block mt-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                      MOQ: {product.minOrderQty}
                    </span>
                  )}
                </div>

              </div>
            </Link>
          </div>
        );
      })}

      {sandalPureProducts.length === 0 && (
        <p className="col-span-full text-center text-gray-600">
          No Sandal Pure products available at the moment.
        </p>
      )}
    </div>
  </div>
</section>


<section className="w-full bg-[#f7f3eb] py-28 mb-20">
  <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16
                  grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

    {/* LEFT — PURPOSE TEXT */}
    <div className="max-w-xl">
      <p className="text-sm tracking-widest text-[#9c7c2e] uppercase">
        Our Purpose
      </p>

      <h2 className="mt-6 text-3xl md:text-4xl font-semibold text-[#1c1c1c] leading-tight">
        Bringing the Healing Power of{" "}
        <span className="text-[#b89b3f]">Indian Sandalwood</span>
        <br /> to Every Home
      </h2>

      <p className="mt-6 text-gray-700 leading-relaxed">
        The purpose of Sandal Pure is to bring the medicinal and wellness
        benefits of Indian sandalwood to every home.
      </p>

      <p className="mt-4 text-gray-700 leading-relaxed">
        Sandalwood possesses anti-inflammatory, antioxidant, antifungal,
        antiviral, and anti-aging properties that help keep the skin healthy,
        radiant, and youthful.
      </p>
    </div>

    {/* RIGHT — PURPOSE CARDS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1c1c1c]">
          Fair Value for Farmers
        </h3>
        <p className="mt-4 text-gray-700 leading-relaxed">
          To ensure fair value and respect for the hard work of sandalwood
          farmers.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1c1c1c]">
          Herbal for Every Home
        </h3>
        <p className="mt-4 text-gray-700 leading-relaxed">
          To deliver sandalwood-based herbal products to every household.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1c1c1c]">
          Purity & Quality
        </h3>
        <p className="mt-4 text-gray-700 leading-relaxed">
          To never compromise on purity, quality, or authenticity.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1c1c1c]">
          Natural Lifestyle
        </h3>
        <p className="mt-4 text-gray-700 leading-relaxed">
          To inspire society towards a natural and chemical-free lifestyle.
        </p>
      </div>

    </div>

  </div>
</section>



          </main>
  );
}