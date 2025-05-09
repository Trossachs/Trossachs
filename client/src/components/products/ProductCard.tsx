import { Link } from "wouter";
import { Star, StarHalf } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import ProductShareButton from "./ProductShareButton";
import { useState, useEffect } from "react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    isNew?: boolean;
    isBestSeller?: boolean;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [productUrl, setProductUrl] = useState("");
  
  // Set full product URL after component mounts
  useEffect(() => {
    // Get the base URL of the site, fallback to a relative URL if not available
    let productPath = `/product/${product.id}`;
    try {
      const baseUrl = window.location.origin;
      setProductUrl(`${baseUrl}${productPath}`);
    } catch (e) {
      // Fallback to just the path if window is not available (SSR)
      setProductUrl(productPath);
    }
  }, [product.id]);
  
  // Generate stars based on rating
  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex text-yellow-400 text-sm">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-current" />
        ))}
        
        {hasHalfStar && <StarHalf key="half" className="h-4 w-4 fill-current" />}
        
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-neutral-300" />
        ))}
        
        <span className="text-neutral-dark ml-1">({product.reviewCount})</span>
      </div>
    );
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event propagation to prevent navigation
    console.log("Quick add clicked for product ID:", product.id);
    addToCart(product.id, 1);
  };

  return (
    <div className="product-card group rounded-lg bg-white border border-neutral-medium overflow-hidden h-full flex flex-col">
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-64 object-cover transition-transform duration-300"
          />
          <div 
            className="quick-add absolute bottom-0 left-0 right-0 bg-primary bg-opacity-90 text-white py-2 text-center opacity-0 transition-opacity transform translate-y-full group-hover:translate-y-0 group-hover:opacity-100"
          >
            <button onClick={handleQuickAdd} className="text-sm font-medium">Quick Add</button>
          </div>
          {/* Badges */}
          {product.isNew && (
            <Badge className="absolute top-2 left-2 bg-accent text-white text-xs">New</Badge>
          )}
          {product.isBestSeller && (
            <Badge className="absolute top-2 left-2 bg-green-600 text-white text-xs">Best Seller</Badge>
          )}
          
          {/* Share Button */}
          <div 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.preventDefault()}
          >
            <ProductShareButton 
              url={productUrl}
              title={product.name}
              image={product.imageUrl}
              position="top"
            />
          </div>
        </div>
      </Link>
      <div className="p-4 flex-grow flex flex-col">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-sm md:text-base mb-1 truncate hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex justify-between items-center mt-auto">
          <div>
            <span className="font-bold text-primary">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-neutral-dark line-through text-sm ml-2">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          {renderRatingStars(product.rating)}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
