import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useCart } from "@/context/CartContext";
import { useQuery } from "@tanstack/react-query";
import { X, Minus, Plus, ShoppingBag as ShoppingBagIcon } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const CartSidebar = () => {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    getSubtotal 
  } = useCart();
  
  const [mounted, setMounted] = useState(false);

  // This effect ensures client-side rendering before operations
  useEffect(() => {
    setMounted(true);
    console.log("CartSidebar mounted, cart items:", cart.length);
  }, []);

  // Force a query refetch when cart is opened
  const { data, isLoading, refetch } = useQuery<{products: any[]}>({
    queryKey: ['/api/products'],
    enabled: mounted && isCartOpen, // Only fetch when cart is open and component is mounted
  });
  
  // When cart is opened, refetch the products data
  useEffect(() => {
    if (mounted && isCartOpen) {
      refetch();
    }
  }, [isCartOpen, mounted, refetch]);

  const products = data?.products || [];
  const subtotal = getSubtotal(products);
  const hasItems = cart.length > 0;

  if (!mounted) return null;

  return (
    <div 
      className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out overflow-auto ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4 border-b border-neutral-medium">
        <div className="flex justify-between items-center">
          <h3 className="font-heading font-bold text-lg">Your Cart ({cart.length})</h3>
          <button 
            onClick={closeCart}
            className="text-neutral-dark hover:text-primary"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 border-b border-neutral-medium pb-3">
                <Skeleton className="w-16 h-16 rounded" />
                <div className="flex-grow">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : !hasItems ? (
          // Empty cart message
          <div className="text-center py-8">
            <div className="bg-neutral-light p-4 rounded-full inline-flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-neutral-dark" />
            </div>
            <p className="text-neutral-dark">Your cart is empty</p>
            <Button 
              onClick={closeCart}
              className="mt-4 bg-primary text-white hover:bg-opacity-90"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          // Cart items
          <>
            {cart.map((item) => {
              const product = products.find((p: any) => p.id === item.productId);
              if (!product) return null;
              
              return (
                <div key={item.productId} className="flex items-center space-x-3 border-b border-neutral-medium pb-3">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-16 h-16 object-cover rounded" 
                  />
                  <div className="flex-grow">
                    <h4 className="font-medium text-sm truncate">{product.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-primary font-bold">{formatPrice(product.price)}</span>
                      <div className="flex items-center border border-neutral-medium rounded">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-2 py-1"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-2 py-1"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="text-neutral-dark hover:text-destructive"
                    aria-label="Remove item"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>
      
      <div className="border-t border-neutral-medium p-4 mt-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Subtotal:</span>
          <span className="font-bold">{formatPrice(subtotal)}</span>
        </div>
        <Button
          className="w-full bg-primary text-white hover:bg-opacity-90 mb-2"
          disabled={!hasItems}
        >
          Checkout
        </Button>
        <Link href="/cart" onClick={closeCart}>
          <Button 
            variant="outline" 
            className="w-full text-primary border-primary hover:bg-neutral-light"
          >
            View Cart
          </Button>
        </Link>
      </div>
    </div>
  );
};

// Custom ShoppingBag icon for empty cart
const ShoppingBag = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

export default CartSidebar;
