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
      <SheetContent className="flex flex-col w-full sm:max-w-md">
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

        <div className="flex-1 overflow-hidden mt-6 relative">
          {cart.items.length > 0 ? (
            <ScrollArea className="h-full pr-4">
              <div className="flex flex-col gap-0 pb-6">
                {cart.items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
              <ShoppingBag className="h-16 w-16 mb-4 opacity-20" />
              <p>Looks like you haven&apos;t added anything yet.</p>
              <Button
                variant="link"
                className="mt-2 text-primary"
                onClick={toggleCart}
              >
                Start Shopping
              </Button>
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="mt-auto pt-6 space-y-4">
            <Separator />
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(cart.totalPrice)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout
              </p>
            </div>
            
            <CheckoutButton />
            
            <Button
              variant="outline"
              className="w-full text-muted-foreground text-xs h-8"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
