import { useState } from "react";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  title?: string;
  products: any[];
  isLoading?: boolean;
  columns?: number;
}

const ProductGrid = ({ 
  title, 
  products, 
  isLoading = false, 
  columns = 4 
}: ProductGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = columns * 2; // 2 rows of products
  
  // Calculate products to display for current page
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  
  // Calculate total pages
  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      {title && (
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">{title}</h2>
          {totalPages > 1 && (
            <div className="flex space-x-2">
              <button 
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`text-neutral-dark hover:text-primary transition ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Previous page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`text-neutral-dark hover:text-primary transition ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Next page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-4 md:gap-6`}>
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <div key={`skeleton-${index}`} className="rounded-lg overflow-hidden border border-neutral-medium">
              <Skeleton className="w-full h-64" />
              <div className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            </div>
          ))
        ) : products.length === 0 ? (
          // No products message
          <div className="col-span-full text-center py-8">
            <p className="text-neutral-dark">No products found.</p>
          </div>
        ) : (
          // Product cards
          currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
