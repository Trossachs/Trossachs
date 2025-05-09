import { products, type Product, type InsertProduct, categories, type Category, type InsertCategory, users, type User, type InsertUser } from "@shared/schema";

// Interface for storage operations
// Define site settings interface
export interface HeroSlide {
  id: number;
  imageUrl: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface PageContent {
  title: string;
  content: string;
  metaDescription?: string;
  lastUpdated: Date;
}

export interface SiteSettings {
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
  heroCarousel: HeroSlide[];
  pages: {
    about: PageContent;
    contact: PageContent;
  };
}

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Site settings operations
  getSiteSettings(): Promise<SiteSettings>;
  updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings>;
}

// Memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private siteSettings: SiteSettings;
  private userIdCounter: number;
  private productIdCounter: number;
  private categoryIdCounter: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.categoryIdCounter = 1;
    
    // Initialize default site settings
    this.siteSettings = {
      logo: {
        text: 'Trossachs',
        imageUrl: '',
      },
      footer: {
        companyName: 'Trossachs Nigeria Ltd.',
        address: '123 Lagos Island, Lagos, Nigeria',
        phone: '+234 800 123 4567',
        email: 'info@trossachs.ng',
        socialLinks: {
          facebook: 'https://facebook.com/trossachs',
          twitter: 'https://twitter.com/trossachs',
          instagram: 'https://instagram.com/trossachs',
          linkedin: 'https://linkedin.com/company/trossachs',
        },
        copyright: '© 2023 Trossachs. All rights reserved.'
      },
      heroCarousel: [
        {
          id: 1,
          imageUrl: "https://images.unsplash.com/photo-1534271417223-b9dbfd8b7acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
          title: "Traditional Nigerian Fashion",
          subtitle: "Discover our collection of authentic Nigerian designs",
          ctaText: "Shop Now",
          ctaLink: "/category/fashion"
        },
        {
          id: 2,
          imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
          title: "Natural Skincare Products",
          subtitle: "Authentic Nigerian ingredients for radiant skin",
          ctaText: "Explore",
          ctaLink: "/category/skincare"
        },
        {
          id: 3,
          imageUrl: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
          title: "Modern Appliances",
          subtitle: "Quality appliances for your Nigerian home",
          ctaText: "Browse",
          ctaLink: "/category/appliances"
        }
      ],
      pages: {
        about: {
          title: "About Trossachs",
          content: `
            <h2>Our Story</h2>
            <p>Trossachs was founded in 2020 with a vision to provide high-quality Nigerian products to our customers both locally and abroad. We started as a small boutique in Lagos and have since grown to become one of Nigeria's leading e-commerce platforms.</p>
            
            <h2>Our Mission</h2>
            <p>Our mission is to showcase the best of Nigerian craftsmanship, design, and innovation while providing exceptional shopping experiences for our customers. We aim to support local artisans and businesses while bringing authentic Nigerian products to the global market.</p>
            
            <h2>Our Values</h2>
            <ul>
              <li><strong>Quality:</strong> We carefully select every product to ensure the highest quality standards.</li>
              <li><strong>Authenticity:</strong> We celebrate and promote authentic Nigerian craftsmanship and culture.</li>
              <li><strong>Community:</strong> We support local artisans and businesses across Nigeria.</li>
              <li><strong>Sustainability:</strong> We prioritize environmentally responsible practices in our operations.</li>
              <li><strong>Customer Satisfaction:</strong> We are dedicated to providing exceptional service and shopping experiences.</li>
            </ul>
            
            <h2>Our Team</h2>
            <p>Trossachs is powered by a passionate team of Nigerians who are committed to sharing our culture and products with the world. Our diverse team includes experts in retail, technology, logistics, and customer service, all working together to create a seamless shopping experience.</p>
          `,
          metaDescription: "Learn about Trossachs, Nigeria's premium e-commerce platform offering authentic Nigerian fashion, skincare, appliances and more.",
          lastUpdated: new Date('2023-06-15')
        },
        contact: {
          title: "Contact Us",
          content: `
            <h2>Get in Touch</h2>
            <p>We're always eager to hear from our customers. Whether you have a question about our products, need assistance with an order, or want to explore business opportunities, we're here to help.</p>
            
            <h2>Contact Information</h2>
            <ul>
              <li><strong>Address:</strong> 123 Lagos Island, Lagos, Nigeria</li>
              <li><strong>Phone:</strong> +234 800 123 4567</li>
              <li><strong>Email:</strong> info@trossachs.ng</li>
              <li><strong>Business Hours:</strong> Monday to Friday, 9am to 5pm WAT</li>
            </ul>
            
            <h2>Customer Support</h2>
            <p>For order inquiries, product information, or any other customer support needs, please contact our customer service team:</p>
            <p>Email: support@trossachs.ng</p>
            <p>Phone: +234 800 123 4567</p>
            
            <h2>Vendor Relations</h2>
            <p>Interested in selling your products on Trossachs? We're always looking to expand our collection with quality Nigerian products.</p>
            <p>Email: vendors@trossachs.ng</p>
            
            <h2>Career Opportunities</h2>
            <p>Join our growing team! Check our careers page for current openings or send your resume to:</p>
            <p>Email: careers@trossachs.ng</p>
          `,
          metaDescription: "Contact Trossachs for customer support, business inquiries, or questions about our Nigerian products. We're here to help!",
          lastUpdated: new Date('2023-05-10')
        }
      }
    };
    
    // Initialize with default categories
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Add main categories
    const fashionCategory = this.addCategory({ 
      name: "Fashion", 
      slug: "fashion", 
      imageUrl: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80" 
    });
    
    const skincareCategory = this.addCategory({ 
      name: "Skincare", 
      slug: "skincare", 
      imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80" 
    });
    
    const appliancesCategory = this.addCategory({ 
      name: "Appliances", 
      slug: "appliances", 
      imageUrl: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80" 
    });
    
    const utilitiesCategory = this.addCategory({ 
      name: "Utilities", 
      slug: "utilities", 
      imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80" 
    });
    
    // Add subcategories for fashion
    this.addCategory({ 
      name: "Men", 
      slug: "men", 
      parentId: fashionCategory.id 
    });
    
    this.addCategory({ 
      name: "Women", 
      slug: "women", 
      parentId: fashionCategory.id 
    });
    
    this.addCategory({ 
      name: "Kids", 
      slug: "kids", 
      parentId: fashionCategory.id 
    });
    
    // Add sample products
    // Fashion products
    this.addProduct({
      name: "Embroidered Senator Outfit",
      description: "Elegant traditional Nigerian senator outfit with detailed embroidery, perfect for special occasions.",
      price: 12500,
      imageUrl: "https://images.unsplash.com/photo-1591019052241-e4d95a5dc3fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      category: "Fashion",
      subCategory: "Men",
      isNew: true,
      rating: 4.5,
      reviewCount: 24
    });
    
    this.addProduct({
      name: "Ankara Print Maxi Dress",
      description: "Beautiful Ankara print maxi dress featuring vibrant Nigerian patterns and comfortable fit.",
      price: 18500,
      imageUrl: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      category: "Fashion",
      subCategory: "Women",
      isNew: true,
      rating: 4.0,
      reviewCount: 6
    });
    
    this.addProduct({
      name: "Traditional Dashiki",
      description: "Authentic Nigerian dashiki with colorful patterns, comfortable for everyday wear.",
      price: 8500,
      imageUrl: "https://images.unsplash.com/photo-1522242436218-58a4ecf2e8a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      category: "Fashion",
      subCategory: "Men",
      rating: 4.2,
      reviewCount: 15
    });
    
    this.addProduct({
      name: "Kids Ankara Set",
      description: "Adorable Ankara outfit set for children, featuring matching top and bottom with Nigerian patterns.",
      price: 7500,
      imageUrl: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      category: "Fashion",
      subCategory: "Kids",
      isNew: true,
      rating: 4.7,
      reviewCount: 12
    });
    
    this.addProduct({
      name: "Traditional Head Wrap",
      description: "Beautiful Nigerian gele head wrap for special occasions and celebrations.",
      price: 6500,
      imageUrl: "https://images.unsplash.com/photo-1534271417223-b9dbfd8b7acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      category: "Fashion",
      subCategory: "Women",
      rating: 4.3,
      reviewCount: 9
    });
    
    this.addProduct({
      name: "Handmade Nigerian Sandals",
      description: "Handcrafted leather sandals made by Nigerian artisans with traditional patterns.",
      price: 11200,
      imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      category: "Fashion",
      subCategory: "Men",
      rating: 4.4,
      reviewCount: 18
    });
    
    // Skincare products
    this.addProduct({
      name: "Natural Shea Butter Moisturizer",
      description: "Pure and natural shea butter moisturizer sourced from Nigeria, perfect for all skin types.",
      price: 8750,
      oldPrice: 10000,
      imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      category: "Skincare",
      isBestSeller: true,
      rating: 5.0,
      reviewCount: 42
    });
    
    this.addProduct({
      name: "Natural Hibiscus Facial Serum",
      description: "Revitalizing facial serum made with natural hibiscus extract to brighten and rejuvenate your skin.",
      price: 9200,
      imageUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      category: "Skincare",
      isNew: true,
      rating: 4.5,
      reviewCount: 11
    });
    
    this.addProduct({
      name: "African Black Soap",
      description: "Traditional Nigerian black soap made with natural ingredients to cleanse and purify skin.",
      price: 5500,
      imageUrl: "https://images.unsplash.com/photo-1614806687007-2215a9db3b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      category: "Skincare",
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 37
    });
    
    this.addProduct({
      name: "Aloe Vera Gel",
      description: "Pure aloe vera gel sourced from Nigerian farms, perfect for soothing skin irritations.",
      price: 6800,
      imageUrl: "https://images.unsplash.com/photo-1596776071613-1305b0b839ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      category: "Skincare",
      rating: 4.6,
      reviewCount: 23
    });
    
    this.addProduct({
      name: "Moringa Oil Face Mask",
      description: "Nourishing face mask with moringa oil to deeply hydrate and repair skin.",
      price: 7200,
      imageUrl: "https://images.unsplash.com/photo-1596807307303-96382e7e3e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      category: "Skincare",
      isNew: true,
      rating: 4.4,
      reviewCount: 8
    });
    
    this.addProduct({
      name: "Vitamin C Brightening Cream",
      description: "Vitamin C enriched brightening cream to reduce dark spots and even skin tone.",
      price: 8900,
      imageUrl: "https://images.unsplash.com/photo-1531895861208-8504b98fe814?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      category: "Skincare",
      rating: 4.2,
      reviewCount: 14
    });
    
    // Appliances products
    this.addProduct({
      name: "Multi-Function Blender Premium",
      description: "High-powered multi-function blender for all your kitchen needs with multiple attachments.",
      price: 25000,
      imageUrl: "https://pixabay.com/get/g3456e6e98305dd53aebe1da713fec4e51849137f5e503a477af89a979d0326bd05889394fa5b5c99b38ee4300554a4fae00a353129411fefefd4a7f1a10aadc1_1280.jpg",
      category: "Appliances",
      rating: 4.0,
      reviewCount: 16
    });
    
    this.addProduct({
      name: "Portable Air Conditioner - Energy Saving",
      description: "Energy efficient portable air conditioner perfect for the Nigerian climate, low electricity consumption.",
      price: 85000,
      imageUrl: "https://pixabay.com/get/g8dcb0df12bb196f35f1fa4a2b69160bc7353e7e33eb1eeba76ff303b90fddc60d481d9d3cbeef0958c7e16438191a846f16aa617110c6aaf8d030c90e85db8eb_1280.jpg",
      category: "Appliances",
      isNew: true,
      rating: 4.0,
      reviewCount: 3
    });
    
    this.addProduct({
      name: "Electric Pressure Cooker",
      description: "Modern electric pressure cooker to prepare Nigerian dishes quickly and efficiently.",
      price: 32000,
      imageUrl: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      category: "Appliances",
      isBestSeller: true,
      rating: 4.7,
      reviewCount: 28
    });
    
    this.addProduct({
      name: "Solar Powered Fan",
      description: "Eco-friendly solar powered fan, perfect for Nigerian power outages and saving on electricity.",
      price: 18000,
      imageUrl: "https://images.unsplash.com/photo-1565330502541-4937be8552e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      category: "Appliances",
      rating: 4.3,
      reviewCount: 19
    });
    
    // Utilities products
    this.addProduct({
      name: "Handwoven Storage Basket Set (3)",
      description: "Set of three handwoven storage baskets made by Nigerian artisans, perfect for organizing your home.",
      price: 15800,
      imageUrl: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      category: "Utilities",
      rating: 3.5,
      reviewCount: 8
    });
    
    this.addProduct({
      name: "Handcrafted Wall Hanging - Tribal",
      description: "Beautiful handcrafted tribal wall hanging to add Nigerian cultural touch to your home decor.",
      price: 12300,
      imageUrl: "https://pixabay.com/get/gf4c95b0dcc399d90a58ab8c42497b4b807559398274b37d04d6e63cbce4664fa184fa8a490e4f4f41599b16da24e01868311d1114a9610cae9ee6c348ca0ef2f_1280.jpg",
      category: "Utilities",
      isNew: true,
      rating: 4.0,
      reviewCount: 2
    });
    
    this.addProduct({
      name: "Decorative Throw Pillows",
      description: "Set of decorative throw pillows with traditional Nigerian patterns to enhance your living space.",
      price: 9500,
      imageUrl: "https://images.unsplash.com/photo-1588098245633-71fecf1ea0d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      category: "Utilities",
      rating: 4.5,
      reviewCount: 15
    });
    
    this.addProduct({
      name: "African Print Table Runner",
      description: "Colorful table runner with African prints to bring vibrant Nigerian aesthetics to your dining area.",
      price: 7800,
      imageUrl: "https://images.unsplash.com/photo-1595570932563-43c551095842?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      category: "Utilities",
      rating: 4.2,
      reviewCount: 7
    });
  }

  // Helper method to add a product
  private addProduct(product: Omit<Product, "id">): Product {
    const id = this.productIdCounter++;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  // Helper method to add a category
  private addCategory(category: Omit<Category, "id">): Category {
    const id = this.categoryIdCounter++;
    const newCategory = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category.toLowerCase() === category.toLowerCase(),
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerCaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery) ||
        product.category.toLowerCase().includes(lowerCaseQuery) ||
        (product.subCategory && product.subCategory.toLowerCase().includes(lowerCaseQuery))
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug.toLowerCase() === slug.toLowerCase(),
    );
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Product update
  async updateProduct(id: number, productUpdate: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    
    if (!product) {
      return undefined;
    }
    
    const updatedProduct = { ...product, ...productUpdate };
    this.products.set(id, updatedProduct);
    
    return updatedProduct;
  }

  // Site settings operations
  async getSiteSettings(): Promise<SiteSettings> {
    return this.siteSettings;
  }

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    if (settings.logo) {
      this.siteSettings.logo = {
        ...this.siteSettings.logo,
        ...settings.logo
      };
    }
    
    if (settings.footer) {
      this.siteSettings.footer = {
        ...this.siteSettings.footer,
        ...settings.footer,
        socialLinks: {
          ...this.siteSettings.footer.socialLinks,
          ...(settings.footer.socialLinks || {})
        }
      };
    }
    
    if (settings.heroCarousel) {
      this.siteSettings.heroCarousel = [...settings.heroCarousel];
    }
    
    if (settings.pages) {
      this.siteSettings.pages = {
        ...this.siteSettings.pages,
        ...settings.pages
      };
    }
    
    return this.siteSettings;
  }
}

export const storage = new MemStorage();
