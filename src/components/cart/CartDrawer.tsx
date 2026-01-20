"use client";

import { ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "./CartItem";
import { CheckoutButton } from "./CheckoutButton";
import { formatPrice } from "@/lib/cart-utils";

export function CartDrawer() {
  const { cart, isCartOpen, toggleCart, clearCart } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        <div className="flex h-full flex-col">
          <div className="px-6 pt-6">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Your Cart ({cart.totalItems})
              </SheetTitle>
              <SheetDescription>
                {cart.items.length > 0
                  ? "Review your items before checkout."
                  : "Your cart is currently empty."}
              </SheetDescription>
            </SheetHeader>
          </div>

          <div className="flex-1 overflow-hidden mt-6">
            {cart.items.length > 0 ? (
              <ScrollArea className="h-full px-6">
                <div className="flex flex-col pb-6">
                  {cart.items.map((item) => (
                    <CartItem key={item.product.id} item={item} />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground px-6">
                <ShoppingBag className="h-16 w-16 mb-4 opacity-20" />
                <p>Looks like you haven&apos;t added anything yet.</p>
                <Button variant="link" className="mt-2 text-primary" onClick={toggleCart}>
                  Start Shopping
                </Button>
              </div>
            )}
          </div>

          {cart.items.length > 0 && (
            <div className="border-t px-6 py-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(cart.totalPrice)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <CheckoutButton />
                <Button
                  variant="outline"
                  className="w-full text-muted-foreground text-xs h-8"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
