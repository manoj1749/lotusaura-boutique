import { ProductWithTag } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: ProductWithTag[];
  showAddToCart?: boolean;
}

export function ProductGrid({ products, showAddToCart = false }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          showAddToCart={showAddToCart} 
        />
      ))}
    </div>
  );
}
