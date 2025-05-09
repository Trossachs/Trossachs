import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryGrid = () => {
  const { data, isLoading } = useQuery<{categories: any[]}>({
    queryKey: ['/api/categories'],
  });

  const categories = data?.categories || [];
  
  // Filter main categories (those without parentId)
  const mainCategories = categories.filter(cat => !cat.parentId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-40 md:h-64 rounded-lg" />
        ))}
      </div>
    );
  }

  // Fallback to hardcoded categories if API fails
  const displayCategories = mainCategories.length > 0 ? mainCategories : [
    { 
      id: 1, 
      name: "Fashion", 
      slug: "fashion", 
      imageUrl: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80" 
    },
    { 
      id: 2, 
      name: "Skincare", 
      slug: "skincare", 
      imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80" 
    },
    { 
      id: 3, 
      name: "Appliances", 
      slug: "appliances", 
      imageUrl: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80" 
    },
    { 
      id: 4, 
      name: "Utilities", 
      slug: "utilities", 
      imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80" 
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {displayCategories.map((category) => (
        <Link key={category.id} href={`/category/${category.slug}`}>
          <div className="category-card relative rounded-lg overflow-hidden group h-40 md:h-64">
            <img 
              src={category.imageUrl} 
              alt={`${category.name} category`} 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <h3 className="font-heading font-bold text-lg md:text-xl">{category.name}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
