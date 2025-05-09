import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Helmet } from "react-helmet";
import ProductGrid from "@/components/products/ProductGrid";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatPrice, filterProductsByCategory, filterProductsBySubCategory, filterProductsByPrice } from "@/lib/utils";

const ProductList = () => {
  const [_, params] = useRoute("/category/:category");
  const [location, setLocation] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const subCategoryParam = urlParams.get("subcategory");
  
  const category = params?.category || "all";
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [subCategory, setSubCategory] = useState<string>(subCategoryParam || "all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [newOnly, setNewOnly] = useState<boolean>(false);
  const [bestSellersOnly, setBestSellersOnly] = useState<boolean>(false);
  
  const { data, isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const allProducts = data?.products || [];
  
  // Update subcategory from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subCatParam = params.get("subcategory");
    if (subCatParam) {
      setSubCategory(subCatParam);
    } else {
      setSubCategory("all");
    }
  }, [location]);
  
  // Apply filters
  let filteredProducts = [...allProducts];
  
  // Filter by category
  if (category !== "all") {
    filteredProducts = filterProductsByCategory(filteredProducts, category);
  }
  
  // Filter by subcategory
  if (subCategory && subCategory !== "all") {
    filteredProducts = filterProductsBySubCategory(filteredProducts, subCategory);
  }
  
  // Filter by price range
  filteredProducts = filterProductsByPrice(filteredProducts, priceRange[0], priceRange[1]);
  
  // Filter by "new only"
  if (newOnly) {
    filteredProducts = filteredProducts.filter(product => product.isNew);
  }
  
  // Filter by "best sellers only"
  if (bestSellersOnly) {
    filteredProducts = filteredProducts.filter(product => product.isBestSeller);
  }
  
  // Sort products
  switch (sortBy) {
    case "price-low-high":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high-low":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      filteredProducts.sort((a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1);
      break;
    default: // featured - best sellers first
      filteredProducts.sort((a, b) => (a.isBestSeller === b.isBestSeller) ? 0 : a.isBestSeller ? -1 : 1);
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handleSubCategoryChange = (value: string) => {
    setSubCategory(value);
    
    // Update URL with subcategory parameter
    const params = new URLSearchParams(window.location.search);
    if (value === "all") {
      params.delete("subcategory");
    } else {
      params.set("subcategory", value);
    }
    
    const newSearch = params.toString();
    const newLocation = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    setLocation(newLocation);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Get page title based on category
  const getCategoryTitle = () => {
    if (category === "all") return "All Products";
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <>
      <Helmet>
        <title>{getCategoryTitle()} - Trossachs</title>
        <meta name="description" content={`Shop our range of Nigerian ${category} products. Quality items with fast delivery nationwide.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-6">{getCategoryTitle()}</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white p-4 rounded-lg border border-neutral-medium sticky top-24">
              <h2 className="font-heading font-bold text-lg mb-4">Filters</h2>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <Slider
                  min={0}
                  max={100000}
                  step={1000}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={handlePriceChange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Subcategories Filter - Only show for Fashion category */}
              {category === "fashion" && (
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Subcategory</h3>
                  <Select value={subCategory} onValueChange={handleSubCategoryChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subcategories</SelectItem>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="kids">Kids</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Product Type Filters */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Product Type</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="new-only" 
                      checked={newOnly} 
                      onCheckedChange={(checked) => setNewOnly(checked as boolean)} 
                    />
                    <Label htmlFor="new-only">New Arrivals</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="best-sellers" 
                      checked={bestSellersOnly} 
                      onCheckedChange={(checked) => setBestSellersOnly(checked as boolean)} 
                    />
                    <Label htmlFor="best-sellers">Best Sellers</Label>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Sort Order */}
              <div>
                <h3 className="font-medium mb-3">Sort By</h3>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                    <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Customer Rating</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-neutral-dark">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            
            <ProductGrid 
              products={filteredProducts} 
              isLoading={isLoading} 
              columns={3} 
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;
