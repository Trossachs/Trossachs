import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useCart } from "@/context/CartContext";
import { Trash2, ShoppingBag, Plus, Minus, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import ProductGrid from "@/components/products/ProductGrid";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getSubtotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Fetch all products
  const { data, isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const products = data?.products || [];
  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product
    };
  }).filter(item => item.product); // Filter out items where product wasn't found

  const subtotal = getSubtotal(products);
  const shipping = subtotal >= 15000 ? 0 : 1500;
  const total = subtotal + shipping;
  const hasItems = cartItems.length > 0;

  // Fetch recommended products (new arrivals or best sellers)
  const recommendedProducts = products
    .filter(product => product.isNew || product.isBestSeller)
    .slice(0, 4);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false);
      clearCart();
      
      // Show success message
      alert("Thank you for your order! This is a demo, so no actual order has been placed.");
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>Your Cart - Trossachs</title>
        <meta name="description" content="Review and checkout items in your shopping cart. Trossachs offers authentic Nigerian products with nationwide delivery." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-6">Your Shopping Cart</h1>
        
        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 border border-neutral-medium rounded-lg">
                  <Skeleton className="w-24 h-24 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Skeleton className="h-60 w-full rounded-lg" />
            </div>
          </div>
        ) : !hasItems ? (
          // Empty cart
          <div className="text-center py-12 max-w-md mx-auto">
            <div className="bg-neutral-light p-6 rounded-full inline-flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-neutral-dark" />
            </div>
            <h2 className="text-2xl font-heading font-bold mb-4">Your cart is empty</h2>
            <p className="text-neutral-dark mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link href="/">
              <Button className="bg-primary text-white hover:bg-primary/90">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          // Cart with items
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg border border-neutral-medium overflow-hidden">
                <div className="p-4 bg-neutral-light border-b border-neutral-medium">
                  <div className="flex justify-between">
                    <h2 className="font-heading font-bold">Cart Items ({cartItems.length})</h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-neutral-dark hover:text-destructive"
                      onClick={clearCart}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Clear Cart
                    </Button>
                  </div>
                </div>
                
                <div className="divide-y divide-neutral-medium">
                  {cartItems.map(({ product, quantity, productId }) => (
                    <div key={productId} className="p-4 flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-medium hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        
                        {product.category && (
                          <div className="text-sm text-neutral-dark mt-1">
                            Category: {product.category}
                            {product.subCategory && ` / ${product.subCategory}`}
                          </div>
                        )}
                        
                        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center space-x-1">
                            <div className="flex items-center border border-neutral-medium rounded-md">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-none border-r border-neutral-medium p-0"
                                onClick={() => updateQuantity(productId, quantity - 1)}
                                disabled={quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-10 text-center text-sm">{quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-none border-l border-neutral-medium p-0"
                                onClick={() => updateQuantity(productId, quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-neutral-dark hover:text-destructive h-8 px-2"
                              onClick={() => removeFromCart(productId)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove item</span>
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-primary">
                              {formatPrice(product.price * quantity)}
                            </div>
                            {quantity > 1 && (
                              <div className="text-xs text-neutral-dark">
                                {formatPrice(product.price)} each
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 flex justify-between">
                <Link href="/">
                  <Button variant="outline" className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg border border-neutral-medium overflow-hidden sticky top-24">
                <div className="p-4 bg-neutral-light border-b border-neutral-medium">
                  <h2 className="font-heading font-bold">Order Summary</h2>
                </div>
                
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-dark">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-neutral-dark">Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    
                    {subtotal < 15000 && (
                      <div className="text-xs text-neutral-dark mt-1">
                        Add {formatPrice(15000 - subtotal)} more to qualify for free shipping
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full mt-4 bg-primary text-white hover:bg-primary/90"
                    disabled={!hasItems || isCheckingOut}
                    onClick={handleCheckout}
                  >
                    {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                    {!isCheckingOut && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                  
                  <div className="mt-4 text-xs text-center text-neutral-dark">
                    <p>We accept various payment methods</p>
                    <div className="flex justify-center space-x-2 mt-2">
                      <div className="h-6 bg-white px-2 rounded-sm border border-neutral-medium text-secondary text-xs flex items-center">Visa</div>
                      <div className="h-6 bg-white px-2 rounded-sm border border-neutral-medium text-secondary text-xs flex items-center">Mastercard</div>
                      <div className="h-6 bg-white px-2 rounded-sm border border-neutral-medium text-secondary text-xs flex items-center">PayPal</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-heading text-2xl font-bold mb-6">
              {hasItems ? "You Might Also Like" : "Our Recommended Products"}
            </h2>
            <ProductGrid products={recommendedProducts} columns={4} />
          </section>
        )}
      </div>
    </>
  );
};

export default Cart;
