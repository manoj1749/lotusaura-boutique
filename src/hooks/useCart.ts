import { useCart as useCartContext } from "@/components/cart/CartProvider";

// Re-exporting the hook from the provider file for cleaner imports
// Alternatively, we could define the hook here if we separated the context
export const useCart = useCartContext;
