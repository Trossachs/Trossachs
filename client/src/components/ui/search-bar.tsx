import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Link } from "wouter";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery<{products: any[]}>({
    queryKey: ['/api/products'],
    enabled: searchTerm.length >= 2,
  });

  const allProducts = data?.products || [];
  
  // Filter products based on search term
  const filteredProducts = searchTerm.length >= 2
    ? allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  // Limit to 5 results for dropdown
  const displayProducts = filteredProducts.slice(0, 5);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length >= 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowResults(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current && 
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          ref={searchInputRef}
          type="text"
          id="searchInput"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full py-2 px-4 border border-neutral-medium rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
        />
        {searchTerm ? (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-10 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-dark hover:text-primary p-0"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-dark hover:text-primary p-0"
          aria-label="Search"
          disabled
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      {showResults && (
        <div 
          ref={searchResultsRef}
          className="absolute z-50 bg-white w-full mt-1 rounded-lg shadow-lg border border-neutral-medium overflow-hidden"
        >
          {isLoading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-4 text-center text-neutral-dark">
              No products found matching "{searchTerm}"
            </div>
          ) : (
            <>
              {displayProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`} onClick={() => setShowResults(false)}>
                  <div className="flex items-center space-x-3 p-3 hover:bg-neutral-light cursor-pointer">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <span className="text-primary font-bold text-sm">{formatPrice(product.price)}</span>
                    </div>
                  </div>
                </Link>
              ))}
              
              {filteredProducts.length > 5 && (
                <Link 
                  href={`/search?q=${encodeURIComponent(searchTerm)}`}
                  onClick={() => setShowResults(false)}
                  className="p-2 text-center text-primary hover:underline cursor-pointer block"
                >
                  See all {filteredProducts.length} results
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
