import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";

interface SearchResult {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: Product[];
  isSearching: boolean;
  clearSearch: () => void;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  totalResults: number;
}

export function useSearch(): SearchResult {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);

  // Reset showResults when search term is cleared
  useEffect(() => {
    if (!searchTerm) {
      setShowResults(false);
    }
  }, [searchTerm]);

  // Fetch all products
  const { data, isLoading } = useQuery({
    queryKey: ['/api/products'],
    enabled: searchTerm.length >= 2, // Only fetch when there's a meaningful search term
  });

  const allProducts = data?.products || [];
  
  // Filter products based on search term
  const searchResults = searchTerm.length >= 2
    ? allProducts.filter(product => {
        const searchableContent = [
          product.name,
          product.description,
          product.category,
          product.subCategory
        ].filter(Boolean).join(" ").toLowerCase();
        
        return searchableContent.includes(searchTerm.toLowerCase());
      })
    : [];

  const clearSearch = () => {
    setSearchTerm("");
    setShowResults(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching: isLoading,
    clearSearch,
    showResults,
    setShowResults,
    totalResults: searchResults.length
  };
}

export default useSearch;
