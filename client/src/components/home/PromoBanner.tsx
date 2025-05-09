import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface PromoBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundUrl?: string;
}

const PromoBanner = ({
  title = "Special Offers This Week",
  subtitle = "Up to 30% off on selected products",
  ctaText = "Shop Now",
  ctaLink = "/category/sale",
  backgroundUrl = "https://pixabay.com/get/g0e18e6877ba18597cfc636a28a8b1d7de2b6d395fdbc62299f552ab04deefca83504492c14452834957f5f1972bc83c112f6fb153c5f3824c26e3d03298bd755_1280.jpg"
}: PromoBannerProps) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div 
          className="relative h-48 md:h-64 rounded-lg overflow-hidden" 
          style={{
            background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('${backgroundUrl}')`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="font-accent text-2xl md:text-4xl font-bold mb-2">{title}</h2>
              <p className="mb-4 text-lg">{subtitle}</p>
              <Link href={ctaLink}>
                <Button className="bg-accent text-white px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition">
                  {ctaText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
