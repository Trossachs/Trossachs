import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import HeroCarousel from "@/components/home/HeroCarousel";
import ProductGrid from "@/components/products/ProductGrid";
import CategoryGrid from "@/components/products/CategoryGrid";
import PromoBanner from "@/components/home/PromoBanner";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";

const Home = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const products = data?.products || [];

  // Filter featured products (best sellers or manually featured)
  const featuredProducts = products.filter(product => product.isBestSeller).slice(0, 4);
  
  // If there aren't enough best sellers, add some other products
  if (featuredProducts.length < 4) {
    const additionalProducts = products
      .filter(product => !featuredProducts.some(fp => fp.id === product.id))
      .slice(0, 4 - featuredProducts.length);
    
    featuredProducts.push(...additionalProducts);
  }
  
  // Filter new arrivals
  const newProducts = products.filter(product => product.isNew).slice(0, 4);
  
  // If there aren't enough new products, add some other products
  if (newProducts.length < 4) {
    const additionalNewProducts = products
      .filter(product => 
        !product.isNew && 
        !newProducts.some(np => np.id === product.id)
      )
      .slice(0, 4 - newProducts.length);
    
    newProducts.push(...additionalNewProducts);
  }

  return (
    <>
      <Helmet>
        <title>Trossachs - Nigerian E-commerce Store</title>
        <meta name="description" content="Shop the best Nigerian fashion, skincare, appliances and utilities. Authentic products with nationwide delivery." />
      </Helmet>
      
      {/* Hero Carousel */}
      <HeroCarousel />
      
      {/* Categories */}
      <section className="py-12 bg-neutral-light">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-8">Shop By Category</h2>
          <CategoryGrid />
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <ProductGrid 
            title="Featured Products" 
            products={featuredProducts} 
            isLoading={isLoading} 
          />
        </div>
      </section>
      
      {/* Promo Banner */}
      <PromoBanner />
      
      {/* New Arrivals */}
      <section className="py-12 bg-neutral-light">
        <div className="container mx-auto px-4">
          <ProductGrid 
            title="New Arrivals" 
            products={newProducts} 
            isLoading={isLoading} 
          />
        </div>
      </section>
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Newsletter */}
      <NewsletterSection />
    </>
  );
};

export default Home;
