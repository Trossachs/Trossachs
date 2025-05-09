// CommonJS version of storage implementation for Netlify Functions
// This file provides a compatibility layer to avoid ESM/CJS conflicts

// Dummy schema if imports fail
const dummySchemas = {
  Product: class {},
  InsertProduct: class {},
  Category: class {},
  InsertCategory: class {},
  User: class {},
  InsertUser: class {}
};

// Load schema types or use fallbacks
let Product, InsertProduct, Category, InsertCategory, User, InsertUser;
try {
  const schema = require('../../shared/schema.js');
  Product = schema.Product || dummySchemas.Product;
  InsertProduct = schema.InsertProduct || dummySchemas.InsertProduct;
  Category = schema.Category || dummySchemas.Category;
  InsertCategory = schema.InsertCategory || dummySchemas.InsertCategory;
  User = schema.User || dummySchemas.User;
  InsertUser = schema.InsertUser || dummySchemas.InsertUser;
  console.log('[netlify-storage] Successfully loaded schemas');
} catch (error) {
  console.error('[netlify-storage] Error loading schemas:', error);
  Product = dummySchemas.Product;
  InsertProduct = dummySchemas.InsertProduct;
  Category = dummySchemas.Category;
  InsertCategory = dummySchemas.InsertCategory;
  User = dummySchemas.User;
  InsertUser = dummySchemas.InsertUser;
}

// In-memory storage implementation for Netlify Functions
class MemStorage {
  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.categoryIdCounter = 1;
    
    // Initialize with default data
    this.siteSettings = {
      logo: {
        text: "Trossachs",
        imageUrl: "/logo.png"
      },
      footer: {
        companyName: "Trossachs Nigeria Ltd",
        address: "123 Lagos Street, Nigeria",
        phone: "+234 123 456 7890",
        email: "info@trossachs.ng",
        socialLinks: {
          facebook: "https://facebook.com/trossachs",
          twitter: "https://twitter.com/trossachs",
          instagram: "https://instagram.com/trossachs"
        },
        copyright: "© 2025 Trossachs. All rights reserved."
      },
      heroCarousel: [
        {
          id: 1,
          imageUrl: "/images/hero-1.jpg",
          title: "Authentic Nigerian Fashion",
          subtitle: "Discover our latest collection of traditional and modern Nigerian clothing",
          ctaText: "Shop Now",
          ctaLink: "/shop"
        },
        {
          id: 2,
          imageUrl: "/images/hero-2.jpg",
          title: "Handcrafted Accessories",
          subtitle: "Unique accessories made by local artisans",
          ctaText: "Browse Collection",
          ctaLink: "/shop/accessories"
        }
      ],
      pages: {
        about: {
          title: "About Trossachs",
          content: "Trossachs is Nigeria's premier e-commerce destination for authentic Nigerian fashion and accessories. Founded in 2020, we work directly with local artisans and designers to bring traditional craftsmanship to the modern world.",
          metaDescription: "Learn about Trossachs, Nigeria's leading e-commerce platform for authentic Nigerian fashion and accessories.",
          lastUpdated: new Date("2025-01-15")
        },
        contact: {
          title: "Contact Us",
          content: "We'd love to hear from you! Reach out to our team with any questions, feedback, or inquiries.",
          metaDescription: "Contact Trossachs customer service for questions about our Nigerian fashion products and accessories.",
          lastUpdated: new Date("2025-01-15")
        }
      }
    };
    
    // Add initial products and categories
    this.initializeDefaultData();
  }
  
  // Initialize with sample data (simplified)
  initializeDefaultData() {
    // Add sample categories
    this.addCategory({
      name: "Fashion",
      slug: "fashion",
      description: "Traditional and modern Nigerian clothing"
    });
    
    this.addCategory({
      name: "Accessories",
      slug: "accessories",
      description: "Handcrafted jewelry and accessories"
    });
    
    // Add sample products
    this.addProduct({
      name: "Embroidered Senator Outfit",
      description: "Traditional Nigerian senator outfit with detailed embroidery",
      price: 15000,
      imageUrl: "/products/senator-outfit.jpg",
      categoryId: 1,
      inStock: true,
      rating: 4.8,
      reviewCount: 24
    });
    
    this.addProduct({
      name: "Beaded Necklace Set",
      description: "Handcrafted beaded necklace with matching earrings",
      price: 8500,
      imageUrl: "/products/beaded-necklace.jpg",
      categoryId: 2,
      inStock: true,
      rating: 4.6,
      reviewCount: 18
    });
  }
  
  // Helper methods
  addProduct(product) {
    const id = this.productIdCounter++;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  addCategory(category) {
    const id = this.categoryIdCounter++;
    const newCategory = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  
  async getUserByUsername(username) {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }
  
  async createUser(insertUser) {
    const id = this.userIdCounter++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Product operations
  async getAllProducts() {
    return Array.from(this.products.values());
  }
  
  async getProductById(id) {
    return this.products.get(id);
  }
  
  async getProductsByCategory(category) {
    const categoryObj = Array.from(this.categories.values()).find(
      c => c.slug === category
    );
    
    if (!categoryObj) {
      return [];
    }
    
    return Array.from(this.products.values()).filter(
      p => p.categoryId === categoryObj.id
    );
  }
  
  async searchProducts(query) {
    query = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
    );
  }
  
  async createProduct(product) {
    const id = this.productIdCounter++;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  // Category operations
  async getAllCategories() {
    return Array.from(this.categories.values());
  }
  
  async getCategoryBySlug(slug) {
    return Array.from(this.categories.values()).find(
      c => c.slug === slug
    );
  }
  
  async createCategory(category) {
    const id = this.categoryIdCounter++;
    const newCategory = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  // Update operations
  async updateProduct(id, productUpdate) {
    const product = this.products.get(id);
    if (!product) {
      return undefined;
    }
    
    const updatedProduct = { ...product, ...productUpdate };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  // Site settings operations
  async getSiteSettings() {
    return this.siteSettings;
  }
  
  async updateSiteSettings(settings) {
    this.siteSettings = {
      ...this.siteSettings,
      ...settings
    };
    return this.siteSettings;
  }
}

// Create storage instance
const storage = new MemStorage();

// Export for CommonJS
module.exports = {
  storage
};