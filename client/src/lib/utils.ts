import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price in Naira
export function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}`;
}

// Format rating from number to stars
export function formatRating(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    full: fullStars,
    half: hasHalfStar ? 1 : 0,
    empty: emptyStars
  };
}

// Filter products by price range
export function filterProductsByPrice(products: any[], minPrice: number, maxPrice: number) {
  return products.filter(product => 
    product.price >= minPrice && product.price <= maxPrice
  );
}

// Filter products by category
export function filterProductsByCategory(products: any[], category: string) {
  if (!category || category === 'all') return products;
  return products.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
}

// Filter products by subcategory
export function filterProductsBySubCategory(products: any[], subCategory: string) {
  if (!subCategory || subCategory === 'all') return products;
  return products.filter(product => 
    product.subCategory && product.subCategory.toLowerCase() === subCategory.toLowerCase()
  );
}

// Search products
export function searchProducts(products: any[], query: string) {
  if (!query || query.trim() === '') return products;
  
  const searchTerms = query.toLowerCase().trim().split(' ');
  return products.filter(product => {
    const searchableText = [
      product.name,
      product.description,
      product.category,
      product.subCategory
    ].filter(Boolean).join(' ').toLowerCase();
    
    return searchTerms.some(term => searchableText.includes(term));
  });
}
