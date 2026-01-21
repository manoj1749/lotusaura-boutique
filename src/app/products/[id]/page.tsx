import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { db } from "@/db/client";
import { products, productImages } from "@/db/schema";
import { eq, not, and, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { Heart, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/cart-utils";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductGallery } from "@/components/products/ProductGallery";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const productId = parseInt(id);

  if (isNaN(productId)) return { title: "Product Not Found" };

  const product = await db.select().from(products).where(eq(products.id, productId)).get();

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Lotus Aura Boutique`,
    description: product.description || `Buy ${product.name} at Lotus Aura Boutique.`,
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} at Lotus Aura Boutique.`,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = parseInt(id);

  if (isNaN(productId)) {
    notFound();
  }

  // 1. Fetch main product first (criticial dependency)
  const productData = await db.select().from(products).where(eq(products.id, productId)).get();

  if (!productData) {
    notFound();
  }

  // 2. Fetch all other data in parallel
  // - Images: for gallery
  // - Candidates for "Related Products": fetch a pool of Latest, Category, and Filler items to deduplicate in memory
  const [imagesRecord, latestCandidates, categoryCandidates, fillerCandidates] = await Promise.all([
    // Images
    db.select()
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .all(),
    
    // Latest Candidates (fetch 5)
    db.select().from(products)
      .where(and(eq(products.published, true), not(eq(products.id, productId))))
      .orderBy(desc(products.id))
      .limit(5),

    // Category Candidates (fetch 5)
    productData.category 
      ? db.select().from(products)
          .where(and(
            eq(products.published, true),
            eq(products.category, productData.category),
            not(eq(products.id, productId))
          ))
          .limit(5)
      : Promise.resolve([]),

    // Filler Candidates (fetch 8 to be safe)
    db.select().from(products)
      .where(and(eq(products.published, true), not(eq(products.id, productId))))
      .limit(8)
  ]);

  // Construct images array for Gallery
  const galleryImages = [
    { id: 'main', url: productData.imageUrl, alt: productData.name },
    ...imagesRecord.map(img => ({ id: img.id, url: img.imageUrl, alt: productData.name }))
  ];

  // In-memory Deduplication Logic for Related Products
  const relatedProductsMap = new Map();
  const excludeIds = new Set([productId]);

  const addProduct = (p: any) => {
    if (relatedProductsMap.size >= 4) return;
    if (!excludeIds.has(p.id)) {
      relatedProductsMap.set(p.id, p);
      excludeIds.add(p.id);
    }
  };

  // 1. Add Latest (Top 1 priority)
  if (latestCandidates.length > 0) addProduct(latestCandidates[0]);

  // 2. Add Category (Top 1 priority)
  if (categoryCandidates.length > 0) addProduct(categoryCandidates[0]);

  // 3. Fill remaining slots from Latest, then Category, then Filler
  latestCandidates.forEach(addProduct);
  categoryCandidates.forEach(addProduct);
  fillerCandidates.forEach(addProduct);

  const relatedProducts = Array.from(relatedProductsMap.values()).map(p => ({
    ...p,
    tagColor: p.tagColor || undefined,
  }));

  return (
    <main className="bg-background text-foreground min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />

      {/* Breadcrumbs */}
      <div className="bg-muted/10 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center text-xs text-muted-foreground uppercase tracking-wider space-x-2">
            <Link href="/" className="hover:text-primary transition">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/collections" className="hover:text-primary transition">Collections</Link>
            {productData.category && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">{productData.category}</span>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{productData.name}</span>
          </nav>
        </div>
      </div>

      <div className="flex-1 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Left Column: Images */}
            <ProductGallery images={galleryImages} productName={productData.name} />

            {/* Right Column: Details */}
            <div className="flex flex-col">
              {/* Product Info - Minimalist Style */}
              <div className="flex flex-col h-full">
                <div className="mb-8">
                  <h1 className="font-display text-2xl lg:text-3xl text-foreground mb-2 uppercase tracking-wide">
                    {productData.name}
                  </h1>
                  <p className="text-sm text-muted-foreground mb-4 uppercase tracking-widest">
                    SKU: {productData.id.toString().padStart(6, 'PTCU')}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-xl font-medium text-foreground">
                      {formatPrice(productData.price)}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-foreground/80 mb-6">
                    {productData.dispatchTime || "Dispatched in 3-4 working days."}
                  </p>

                  {/* Dynamic Specifications */}
                  {(productData.material || productData.pattern || productData.washCare) && (
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-8 text-sm text-muted-foreground">
                      {productData.material && (
                         <>
                           <span className="font-medium text-foreground">Material:</span>
                           <span>{productData.material}</span>
                         </>
                      )}
                       {productData.pattern && (
                         <>
                           <span className="font-medium text-foreground">Pattern:</span>
                           <span>{productData.pattern}</span>
                         </>
                      )}
                       {productData.washCare && (
                         <>
                           <span className="font-medium text-foreground">Wash Care:</span>
                           <span>{productData.washCare}</span>
                         </>
                      )}
                    </div>
                  )}

                  {productData.description && (
                     <div className="mb-8 text-sm leading-relaxed text-muted-foreground">
                       {productData.description}
                     </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4 mb-8 max-w-sm">
                   <div className="flex gap-4">
                      {/* Placeholder for Quantity */}
                      <div className="flex items-center border border-input rounded-sm h-[52px] w-24 justify-between px-3">
                        <span className="cursor-pointer text-lg select-none">-</span>
                        <span className="text-sm font-medium">1</span>
                        <span className="cursor-pointer text-lg select-none">+</span>
                      </div>
                      
                      <div className="flex-1">
                        <AddToCartButton product={productData as any} />
                      </div>
                   </div>
                   
                   <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2">
                     <Heart className="h-4 w-4" />
                     <span>Add to Wishlist</span>
                   </button>
                </div>
                
                <div className="mt-8 pt-8 border-t border-dashed border-border/60">
                   <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">
                     WASH CARE, SHIPPING, CANCELLATION & RETURN POLICY
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-24">
            <div className="flex items-center justify-center mb-10 relative">
               <div className="h-px bg-border w-full absolute left-0 top-1/2 -z-10"></div>
               <h2 className="font-dancing text-3xl px-6 bg-background text-primary">You May Also Love</h2>
            </div>
            
            <ProductGrid products={relatedProducts as any} showAddToCart={false} hideActionButtons={true} />
          </div>
          
        </div>
      </div>

      <Footer />
    </main>
  );
}
