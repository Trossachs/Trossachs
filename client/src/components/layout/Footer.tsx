import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
// Define site settings interface
type SiteSettings = {
  logo: {
    text: string;
    imageUrl?: string;
  };
  footer: {
    companyName: string;
    address: string;
    phone: string;
    email: string;
    socialLinks: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
    copyright: string;
  };
};

const Footer = () => {
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
  });

  const settings = settingsData?.settings as SiteSettings | undefined;
  
  if (isLoading) {
    return <FooterSkeleton />;
  }

  return (
    <footer className="bg-secondary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">
              {settings?.logo.text || "Trossachs"}
            </h3>
            <p className="text-neutral-medium mb-4">
              Your premier destination for authentic Nigerian products. From fashion to home essentials, 
              we bring the best of Nigeria to your doorstep.
            </p>
            <div className="flex space-x-4">
              {settings?.footer.socialLinks.facebook && (
                <a 
                  href={settings.footer.socialLinks.facebook} 
                  className="text-neutral-medium hover:text-white transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook size={18} />
                </a>
              )}
              {settings?.footer.socialLinks.twitter && (
                <a 
                  href={settings.footer.socialLinks.twitter} 
                  className="text-neutral-medium hover:text-white transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter size={18} />
                </a>
              )}
              {settings?.footer.socialLinks.instagram && (
                <a 
                  href={settings.footer.socialLinks.instagram} 
                  className="text-neutral-medium hover:text-white transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram size={18} />
                </a>
              )}
              {settings?.footer.socialLinks.linkedin && (
                <a 
                  href={settings.footer.socialLinks.linkedin} 
                  className="text-neutral-medium hover:text-white transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={18} />
                </a>
              )}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-medium hover:text-white transition">Home</Link></li>
              <li><Link href="/category/all" className="text-neutral-medium hover:text-white transition">Shop</Link></li>
              <li><a href="#" className="text-neutral-medium hover:text-white transition">About Us</a></li>
              <li><a href="#" className="text-neutral-medium hover:text-white transition">Contact</a></li>
              <li><a href="#" className="text-neutral-medium hover:text-white transition">FAQs</a></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/category/fashion" className="text-neutral-medium hover:text-white transition">Fashion</Link></li>
              <li><Link href="/category/skincare" className="text-neutral-medium hover:text-white transition">Skincare</Link></li>
              <li><Link href="/category/appliances" className="text-neutral-medium hover:text-white transition">Appliances</Link></li>
              <li><Link href="/category/utilities" className="text-neutral-medium hover:text-white transition">Utilities</Link></li>
              <li><Link href="/category/new" className="text-neutral-medium hover:text-white transition">New Arrivals</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                <span className="text-neutral-medium">{settings?.footer.address || "123 Victoria Island, Lagos, Nigeria"}</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary shrink-0" />
                <span className="text-neutral-medium">{settings?.footer.phone || "+234 123 456 7890"}</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary shrink-0" />
                <span className="text-neutral-medium">{settings?.footer.email || "info@trossachs.ng"}</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-primary shrink-0" />
                <span className="text-neutral-medium">Mon-Fri: 9am - 6pm</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-dark mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-medium text-sm mb-4 md:mb-0">
              {settings?.footer.copyright || "© 2023 Trossachs. All rights reserved."}
            </p>
            <div className="flex items-center space-x-4">
              <div className="h-6 bg-white px-2 rounded-sm text-secondary text-xs flex items-center">Visa</div>
              <div className="h-6 bg-white px-2 rounded-sm text-secondary text-xs flex items-center">Mastercard</div>
              <div className="h-6 bg-white px-2 rounded-sm text-secondary text-xs flex items-center">PayPal</div>
              <div className="h-6 bg-white px-2 rounded-sm text-secondary text-xs flex items-center">Flutterwave</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterSkeleton = () => {
  return (
    <footer className="bg-secondary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info Skeleton */}
          <div>
            <Skeleton className="h-8 w-36 bg-neutral-dark mb-4" />
            <Skeleton className="h-20 w-full bg-neutral-dark mb-4" />
            <div className="flex space-x-4">
              <Skeleton className="h-6 w-6 rounded-full bg-neutral-dark" />
              <Skeleton className="h-6 w-6 rounded-full bg-neutral-dark" />
              <Skeleton className="h-6 w-6 rounded-full bg-neutral-dark" />
              <Skeleton className="h-6 w-6 rounded-full bg-neutral-dark" />
            </div>
          </div>
          
          {/* Quick Links Skeleton */}
          <div>
            <Skeleton className="h-8 w-36 bg-neutral-dark mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-20 bg-neutral-dark" />
              <Skeleton className="h-5 w-24 bg-neutral-dark" />
              <Skeleton className="h-5 w-28 bg-neutral-dark" />
              <Skeleton className="h-5 w-22 bg-neutral-dark" />
              <Skeleton className="h-5 w-16 bg-neutral-dark" />
            </div>
          </div>
          
          {/* Categories Skeleton */}
          <div>
            <Skeleton className="h-8 w-36 bg-neutral-dark mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-20 bg-neutral-dark" />
              <Skeleton className="h-5 w-24 bg-neutral-dark" />
              <Skeleton className="h-5 w-28 bg-neutral-dark" />
              <Skeleton className="h-5 w-22 bg-neutral-dark" />
              <Skeleton className="h-5 w-32 bg-neutral-dark" />
            </div>
          </div>
          
          {/* Contact Skeleton */}
          <div>
            <Skeleton className="h-8 w-36 bg-neutral-dark mb-4" />
            <div className="space-y-3">
              <div className="flex items-start">
                <Skeleton className="h-5 w-5 bg-neutral-dark mr-3" />
                <Skeleton className="h-5 w-48 bg-neutral-dark" />
              </div>
              <div className="flex items-center">
                <Skeleton className="h-5 w-5 bg-neutral-dark mr-3" />
                <Skeleton className="h-5 w-36 bg-neutral-dark" />
              </div>
              <div className="flex items-center">
                <Skeleton className="h-5 w-5 bg-neutral-dark mr-3" />
                <Skeleton className="h-5 w-40 bg-neutral-dark" />
              </div>
              <div className="flex items-center">
                <Skeleton className="h-5 w-5 bg-neutral-dark mr-3" />
                <Skeleton className="h-5 w-32 bg-neutral-dark" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-dark mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Skeleton className="h-5 w-64 bg-neutral-dark mb-4 md:mb-0" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-6 w-12 bg-neutral-dark" />
              <Skeleton className="h-6 w-20 bg-neutral-dark" />
              <Skeleton className="h-6 w-14 bg-neutral-dark" />
              <Skeleton className="h-6 w-24 bg-neutral-dark" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
