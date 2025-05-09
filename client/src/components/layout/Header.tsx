import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import SearchBar from "@/components/ui/search-bar";
import { Heart, User, ShoppingBag, X, ChevronDown, LogOut, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { useToast } from "@/hooks/use-toast";

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

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { getCartCount, openCart } = useCart();
  const { isAdmin, logout } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  const { data: settingsData, isLoading } = useQuery<{ settings: SiteSettings }>({
    queryKey: ["/api/admin/settings"],
  });

  const settings = settingsData?.settings;
  const cartCount = getCartCount();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logo rendering
  const renderLogo = () => {
    if (isLoading) {
      return <Skeleton className="h-8 w-32" />;
    }
    
    if (settings?.logo.imageUrl) {
      return <img src={settings.logo.imageUrl} alt={settings.logo.text} className="h-10" />;
    }
    
    return (
      <>
        <span className="text-accent">T</span>{settings?.logo.text?.substring(1) || "rossachs"}
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-sm hidden md:block">Free shipping on orders over ₦15,000</div>
          <div className="flex space-x-4 text-sm">
            {/* Removed Help and Track Order links as requested */}
          </div>
        </div>
      </div>
      
      {/* Main Header with Integrated Navigation */}
      <div className="container mx-auto px-4 py-4">
        {/* Mobile Navigation Header (Logo and Hamburger Menu in same line) */}
        <div className="lg:hidden flex justify-between items-center w-full mb-4">
          <Link href="/" className="font-heading font-bold text-2xl text-primary flex items-center">
            {renderLogo()}
          </Link>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-secondary hover:text-primary"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
        
        {/* Desktop and Tablet Layout */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full lg:space-x-8">
            {/* Logo (hidden on mobile as it's shown above) */}
            <Link href="/" className="font-heading font-bold text-3xl text-primary hidden lg:flex items-center">
              {renderLogo()}
            </Link>
            
            {/* Desktop Navigation - Now in same line as logo */}
            <nav className="hidden lg:block flex-grow">
              <ul className="flex justify-center space-x-6 text-base">
                <li className="category-item relative group">
                  <Link 
                    href="/category/fashion" 
                    className={`font-medium hover:text-primary px-2 py-2 flex items-center ${location === '/category/fashion' ? 'text-primary' : ''}`}
                  >
                    Fashion <ChevronDown className="ml-1 h-4 w-4" />
                  </Link>
                  <div className="category-dropdown bg-white shadow-lg rounded-b-lg w-48 p-4">
                    <Link href="/category/fashion?subcategory=men" className="block py-2 hover:text-primary">Men</Link>
                    <Link href="/category/fashion?subcategory=women" className="block py-2 hover:text-primary">Women</Link>
                    <Link href="/category/fashion?subcategory=kids" className="block py-2 hover:text-primary">Kids</Link>
                  </div>
                </li>
                <li className="category-item relative group">
                  <Link 
                    href="/category/skincare" 
                    className={`font-medium hover:text-primary px-2 py-2 ${location === '/category/skincare' ? 'text-primary' : ''}`}
                  >
                    Skincare
                  </Link>
                </li>
                <li className="category-item relative group">
                  <Link 
                    href="/category/appliances" 
                    className={`font-medium hover:text-primary px-2 py-2 ${location === '/category/appliances' ? 'text-primary' : ''}`}
                  >
                    Appliances
                  </Link>
                </li>
                <li className="category-item relative group">
                  <Link 
                    href="/category/utilities" 
                    className={`font-medium hover:text-primary px-2 py-2 ${location === '/category/utilities' ? 'text-primary' : ''}`}
                  >
                    Utilities
                  </Link>
                </li>
                <li className="category-item relative group">
                  <Link 
                    href="/category/new" 
                    className={`font-medium hover:text-primary px-2 py-2 ${location === '/category/new' ? 'text-primary' : ''}`}
                  >
                    New Arrivals
                  </Link>
                </li>
                <li className="category-item relative group">
                  <Link 
                    href="/category/sale" 
                    className={`font-medium hover:text-primary px-2 py-2 ${location === '/category/sale' ? 'text-primary' : ''}`}
                  >
                    Sale
                  </Link>
                </li>
              </ul>
            </nav>
            
            {/* Search Bar and Icons */}
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 lg:w-auto w-full">
              {/* Search Bar */}
              <div className="relative w-full md:w-52">
                <SearchBar />
              </div>
              
              {/* Icons */}
              <div className="flex items-center space-x-6">
                <Link href="/wishlist" className="text-secondary hover:text-primary relative">
                  <Heart className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
                
                {/* Admin access icon and dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="text-secondary hover:text-primary relative"
                    aria-label="Admin access"
                    title="Admin access"
                  >
                    <Settings className="h-6 w-6" />
                    {isAdmin && (
                      <span className="absolute -top-1 -right-1 bg-accent w-2 h-2 rounded-full"></span>
                    )}
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      {isAdmin ? (
                        <>
                          <Link href="/admin" className="block px-4 py-2 text-sm text-accent font-medium hover:bg-neutral-light flex items-center">
                            <Settings className="h-4 w-4 mr-2" /> Admin Dashboard
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-neutral-light flex items-center"
                          >
                            <LogOut className="h-4 w-4 mr-2" /> Logout
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsLoginOpen(true);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-primary hover:bg-neutral-light flex items-center"
                        >
                          <Settings className="h-4 w-4 mr-2" /> Admin Login
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={openCart}
                  className="text-secondary hover:text-primary relative cursor-pointer"
                  aria-label="Open cart"
                >
                  <ShoppingBag className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="bg-white border-t border-b border-neutral-medium lg:hidden relative">
          <div className="absolute top-0 left-0 right-0 bg-white shadow-md z-50">
            <ul className="flex flex-col py-2">
              <li>
                <Link 
                  href="/" 
                  className={`block font-medium hover:text-primary px-4 py-3 ${location === '/' ? 'text-primary' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className={`block font-medium hover:text-primary px-4 py-3 ${location === '/contact' ? 'text-primary' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className={`block font-medium hover:text-primary px-4 py-3 ${location === '/about' ? 'text-primary' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About us
                </Link>
              </li>
              <li>
                <Link 
                  href="/shop" 
                  className={`block font-medium hover:text-primary px-4 py-3 ${location === '/shop' ? 'text-primary' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      )}
      {/* Login Dialog */}
      <LoginDialog 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </header>
  );
};

export default Header;
