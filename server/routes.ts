import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertProductSchema, insertCategorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json({ products });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ product });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Get products by category
  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json({ products });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  // Search products
  app.get("/api/products/search/:query", async (req, res) => {
    try {
      const { query } = req.params;
      if (!query || query.length < 2) {
        return res.status(400).json({ message: "Search query must be at least 2 characters" });
      }

      const products = await storage.searchProducts(query);
      res.json({ products });
    } catch (error) {
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  // Create product (admin only in a real app)
  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json({ product });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid product data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create product" });
      }
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get category by slug
  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json({ category });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Create category (admin only in a real app)
  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json({ category });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  // --- Admin API Routes ---
  
  // Update product
  app.patch("/api/admin/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const productUpdate = req.body;
      const updatedProduct = await storage.updateProduct(id, productUpdate);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json({ product: updatedProduct });
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  
  // Get site settings
  app.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json({ settings });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch site settings" });
    }
  });
  
  // Update site settings
  app.patch("/api/admin/settings", async (req, res) => {
    try {
      const settingsUpdate = req.body;
      const updatedSettings = await storage.updateSiteSettings(settingsUpdate);
      res.json({ settings: updatedSettings });
    } catch (error) {
      res.status(500).json({ message: "Failed to update site settings" });
    }
  });
  
  // Get hero carousel slides
  app.get("/api/hero-carousel", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json({ slides: settings.heroCarousel });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hero carousel slides" });
    }
  });
  
  // Update hero carousel slides (admin only)
  app.patch("/api/admin/hero-carousel", async (req, res) => {
    try {
      const carouselSlides = req.body.slides;
      if (!Array.isArray(carouselSlides)) {
        return res.status(400).json({ message: "Invalid data format. Expected array of slides" });
      }
      
      const settingsUpdate = { heroCarousel: carouselSlides };
      const updatedSettings = await storage.updateSiteSettings(settingsUpdate);
      res.json({ slides: updatedSettings.heroCarousel });
    } catch (error) {
      res.status(500).json({ message: "Failed to update hero carousel slides" });
    }
  });
  
  // Get page content
  app.get("/api/pages/:page", async (req, res) => {
    try {
      const { page } = req.params;
      const settings = await storage.getSiteSettings();
      
      if (!settings.pages || !settings.pages[page]) {
        return res.status(404).json({ message: "Page not found" });
      }
      
      res.json({ content: settings.pages[page] });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page content" });
    }
  });
  
  // Update page content (admin only)
  app.patch("/api/admin/pages/:page", async (req, res) => {
    try {
      const { page } = req.params;
      const pageContent = req.body.content;
      
      const settings = await storage.getSiteSettings();
      if (!settings.pages || !settings.pages[page]) {
        return res.status(404).json({ message: "Page not found" });
      }
      
      // Create a partial update for the specific page
      const pagesUpdate = { ...settings.pages };
      pagesUpdate[page] = {
        ...pagesUpdate[page],
        ...pageContent,
        lastUpdated: new Date()
      };
      
      const settingsUpdate = { pages: pagesUpdate };
      const updatedSettings = await storage.updateSiteSettings(settingsUpdate);
      
      res.json({ content: updatedSettings.pages[page] });
    } catch (error) {
      res.status(500).json({ message: "Failed to update page content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
