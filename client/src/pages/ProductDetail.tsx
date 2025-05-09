import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useCart } from "@/context/CartContext";
import { 
  Star, 
  StarHalf, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Heart, 
  ArrowLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ProductGrid from "@/components/products/ProductGrid";
import SocialShare from "@/components/products/SocialShare";
import { formatPrice } from "@/lib/utils";

const ProductDetail = () => {
  const [_, params] = useRoute("/product/:id");
  const [location, setLocation] = useLocation();
  const { addToCart } = useCart();
  
  const productId = params?.id ? parseInt(params.id) : 0;
  
  const [quantity, setQuantity] = useState(1);
  const [currentUrl, setCurrentUrl] = useState("");
  
  // Set the current URL after component mounts
  useEffect(() => {
    try {
      // Get the full URL or fallback to a constructed one
      const url = window.location.href;
      setCurrentUrl(url);
    } catch (e) {
      // Fallback if window is not available (SSR)
      const fallbackUrl = `/product/${productId}`;
      setCurrentUrl(fallbackUrl);
    }
  }, [productId]);
  
  // Get product details
  const { data: productData, isLoading: isProductLoading } = useQuery<{ product: any }>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });
  
  // Get all products for related products
  const { data: allProductsData, isLoading: isAllProductsLoading } = useQuery<{ products: any[] }>({
    queryKey: ['/api/products'],
  });
  
  const product = productData?.product;
  const allProducts = allProductsData?.products || [];
  
  // Get related products (same category, excluding current product)
  const relatedProducts = product
    ? allProducts
        .filter((p: any) => p.category === product.category && p.id !== product.id)
        .slice(0, 4)
    : [];
  
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
  };

  // Generate rating stars
  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-5 w-5 fill-current" />
        ))}
        
        {hasHalfStar && <StarHalf key="half" className="h-5 w-5 fill-current" />}
        
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-5 w-5 text-neutral-300" />
        ))}
      </div>
    );
  };

  if (isProductLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => setLocation("/")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Return to homepage
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} - Trossachs</title>
        <meta name="description" content={product.description.substring(0, 160)} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-muted-foreground flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-auto font-normal text-muted-foreground hover:text-primary"
            onClick={() => setLocation("/")}
          >
            Home
          </Button>
          <span>/</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-auto font-normal text-muted-foreground hover:text-primary"
            onClick={() => setLocation(`/category/${product.category.toLowerCase()}`)}
          >
            {product.category}
          </Button>
          <span>/</span>
          <span className="text-foreground truncate max-w-[150px]">{product.name}</span>
        </div>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg overflow-hidden border border-neutral-medium">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full aspect-square object-cover"
            />
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {renderRatingStars(product.rating)}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
              
              {product.isNew && (
                <Badge className="bg-accent text-white">New</Badge>
              )}
              {product.isBestSeller && (
                <Badge className="bg-green-600 text-white">Best Seller</Badge>
              )}
            </div>
            
            <div className="mb-6">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="ml-2 text-muted-foreground line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            
            <p className="text-neutral-dark mb-6">{product.description}</p>
            
            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <span className="mr-4 font-medium">Quantity:</span>
              <div className="flex items-center border border-neutral-medium rounded-md">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-none border-r border-neutral-medium"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-none border-l border-neutral-medium"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
              <Button 
                className="flex-1 bg-primary text-white hover:bg-primary/90"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
              <Button variant="outline" className="flex-1">
                <Heart className="mr-2 h-4 w-4" /> Add to Wishlist
              </Button>
            </div>
            
            {/* Social Sharing */}
            <div className="mt-6 border-t border-b border-neutral-medium py-4">
              <SocialShare 
                url={currentUrl}
                title={product.name}
                description={product.description}
                image={product.imageUrl}
              />
            </div>
            
            {/* Delivery Info */}
            <div className="mt-6 p-4 bg-neutral-light rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Delivery:</span> Free shipping on orders over ₦15,000
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Returns:</span> Easy 30-day returns
              </p>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full border-b">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="py-4">
              <p className="text-neutral-dark">{product.description}</p>
              {product.category === "Appliances" && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Features:</h3>
                  <ul className="list-disc list-inside space-y-1 text-neutral-dark">
                    <li>Energy-efficient design</li>
                    <li>Made with high-quality materials</li>
                    <li>1-year manufacturer warranty</li>
                    <li>Designed for Nigerian electricity conditions</li>
                  </ul>
                </div>
              )}
            </TabsContent>
            <TabsContent value="reviews" className="py-4">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="text-3xl font-bold">{product.rating.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">out of 5</div>
                </div>
                <div>
                  {renderRatingStars(product.rating)}
                  <div className="text-sm text-muted-foreground">
                    Based on {product.reviewCount} reviews
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {product.reviewCount === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  This product has no reviews yet. Be the first to leave a review!
                </p>
              ) : (
                <div className="space-y-4">
                  {/* Sample reviews - in a real app these would come from the API */}
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          {renderRatingStars(5)}
                        </div>
                        <h4 className="font-medium mt-1">Great product!</h4>
                      </div>
                      <span className="text-sm text-muted-foreground">2 weeks ago</span>
                    </div>
                    <p className="mt-2 text-neutral-dark">
                      This product exceeded my expectations. The quality is amazing and it was delivered quickly.
                    </p>
                    <div className="mt-2 text-sm text-muted-foreground">
                      By Adebayo O.
                    </div>
                  </div>
                  
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          {renderRatingStars(4)}
                        </div>
                        <h4 className="font-medium mt-1">Good value for money</h4>
                      </div>
                      <span className="text-sm text-muted-foreground">1 month ago</span>
                    </div>
                    <p className="mt-2 text-neutral-dark">
                      I'm happy with my purchase. Good quality for the price and fast delivery.
                    </p>
                    <div className="mt-2 text-sm text-muted-foreground">
                      By Chinwe N.
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="shipping" className="py-4">
              <div className="space-y-4 text-neutral-dark">
                <div>
                  <h3 className="font-medium mb-2">Delivery Information:</h3>
                  <p>We deliver to all 36 states in Nigeria.</p>
                  <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                    <li>Lagos: 1-2 business days</li>
                    <li>Other major cities: 2-4 business days</li>
                    <li>Remote areas: 4-7 business days</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Free Shipping:</h3>
                  <p>Orders over ₦15,000 qualify for free standard shipping.</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Returns Policy:</h3>
                  <p>
                    If you're not satisfied with your purchase, you can return it within 30 days for a full refund or exchange.
                    Items must be unused and in original packaging.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        <div className="mt-12">
          <h2 className="font-heading text-2xl font-bold mb-6">You Might Also Like</h2>
          <ProductGrid 
            products={relatedProducts} 
            isLoading={isAllProductsLoading} 
            columns={4} 
          />
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
