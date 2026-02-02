import { ProductWithTag } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: ProductWithTag[];
  hideActionButtons?: boolean;
}

export function ProductGrid({ products, hideActionButtons = false }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-10">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          hideActionButtons={hideActionButtons}
        />
      ))}
    </div>
  );
}
