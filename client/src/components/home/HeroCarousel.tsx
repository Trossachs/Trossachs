import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Authentic Nigerian Fashion",
    subtitle: "Discover our collection of handcrafted Nigerian attire",
    cta: "Shop Now",
    ctaLink: "/category/fashion",
    image: "https://images.unsplash.com/photo-1534126874-5f6762c6181b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800&q=80",
  },
  {
    id: 2,
    title: "Natural Skincare Products",
    subtitle: "Experience the best of Nigerian natural ingredients",
    cta: "Explore",
    ctaLink: "/category/skincare",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800&q=80",
  },
  {
    id: 3,
    title: "Modern Home Appliances",
    subtitle: "Energy-efficient appliances for the Nigerian home",
    cta: "View Collection",
    ctaLink: "/category/appliances",
    image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800&q=80",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <section className="relative">
      <div className="hero-carousel relative h-96 md:h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-item absolute inset-0 w-full h-full flex items-center transition-opacity duration-500 ${
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            style={{
              background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${slide.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="container mx-auto px-4 text-white">
              <div className="max-w-lg">
                <h1 className="font-accent text-4xl md:text-5xl font-bold mb-4">{slide.title}</h1>
                <p className="text-lg mb-8">{slide.subtitle}</p>
                <Link href={slide.ctaLink}>
                  <Button className="bg-primary text-white px-8 py-6 rounded-full font-medium hover:bg-opacity-90 transition">
                    {slide.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Carousel Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition text-primary z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition text-primary z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {/* Carousel Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? "bg-white bg-opacity-100" : "bg-white bg-opacity-50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
