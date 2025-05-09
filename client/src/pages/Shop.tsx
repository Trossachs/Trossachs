import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import ProductCard from "@/components/products/ProductCard";
import { filterProductsByPrice, filterProductsByCategory } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";
import { Product, Category } from "@shared/schema";

export default function Shop() {
  const [location, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState(new URLSearchParams(location.split("?")[1] || ""));
  const categoryParam = searchParams.get("category");
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [sortOption, setSortOption] = useState("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Products query
  const { data: productsData, isLoading: isProductsLoading } = useQuery<{ products: Product[] }>({
    queryKey: ["/api/products"],
  });
  
  // Categories query
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery<{ categories: Category[] }>({
    queryKey: ["/api/categories"],
  });
  
  const products: Product[] = productsData?.products || [];
  const categories: Category[] = categoriesData?.categories || [];
  
  // Apply filters
  const filteredProducts = products
    .filter((product: Product) => filterProductsByPrice(
      [product], 
      priceRange[0], 
      priceRange[1]
    ).length > 0)
    .filter((product: Product) => 
      selectedCategories.length === 0 || 
      selectedCategories.includes(product.category)
    );
  
  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-low") {
      return a.price - b.price;
    } else if (sortOption === "price-high") {
      return b.price - a.price;
    } else if (sortOption === "rating") {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return ratingB - ratingA;
    } else {
      // Default to newest
      return b.id - a.id;
    }
  });
  
  // Handle price range change
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };
  
  // Handle category selection
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setPriceRange([0, 100000]);
    setSelectedCategories([]);
    setSortOption("newest");
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">All Products</h1>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="lg:hidden"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters - Desktop */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <Button variant="outline" className="w-full" onClick={clearFilters}>
              Clear Filters
            </Button>
            
            <div>
              <h3 className="font-medium mb-4">Price Range</h3>
              <div className="px-2">
                <Slider
                  min={0}
                  max={100000}
                  step={1000}
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  className="mb-6"
                />
                <div className="flex justify-between text-sm">
                  <span>₦{priceRange[0].toLocaleString()}</span>
                  <span>₦{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Categories</h3>
              <div className="space-y-2">
                {isCategoriesLoading ? (
                  <p>Loading categories...</p>
                ) : (
                  categories.map((category: Category) => (
                    <div key={category.slug} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category.slug}`} 
                        checked={selectedCategories.includes(category.slug)}
                        onCheckedChange={(checked) => 
                          handleCategoryChange(category.slug, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`category-${category.slug}`}
                        className="font-normal cursor-pointer"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Filters - Mobile */}
        {isMobileFilterOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex justify-end">
            <div className="bg-white w-80 h-full overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-6">
                <Button variant="outline" className="w-full" onClick={clearFilters}>
                  Clear Filters
                </Button>
                
                <div>
                  <h3 className="font-medium mb-4">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      min={0}
                      max={100000}
                      step={1000}
                      value={priceRange}
                      onValueChange={handlePriceChange}
                      className="mb-6"
                    />
                    <div className="flex justify-between text-sm">
                      <span>₦{priceRange[0].toLocaleString()}</span>
                      <span>₦{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Categories</h3>
                  <div className="space-y-2">
                    {isCategoriesLoading ? (
                      <p>Loading categories...</p>
                    ) : (
                      categories.map((category: Category) => (
                        <div key={category.slug} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mobile-category-${category.slug}`} 
                            checked={selectedCategories.includes(category.slug)}
                            onCheckedChange={(checked) => 
                              handleCategoryChange(category.slug, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={`mobile-category-${category.slug}`}
                            className="font-normal cursor-pointer"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Products Grid */}
        <div className="lg:col-span-3">
          {isProductsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-neutral-light animate-pulse h-80 rounded-lg"></div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-neutral-dark">Try adjusting your filters</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {sortedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    oldPrice: product.oldPrice || undefined,
                    imageUrl: product.imageUrl,
                    rating: product.rating || 0,
                    reviewCount: product.reviewCount || 0,
                    isNew: product.isNew || false,
                    isBestSeller: product.isBestSeller || false
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}