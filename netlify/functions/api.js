// This file creates a serverless function that acts as a proxy for our Express API
// Using CommonJS require for better compatibility with Netlify Functions
const express = require('express');
const serverless = require('serverless-http');

// Safely load dependencies with try/catch to handle any import errors gracefully
let storage, z, insertProductSchema, insertCategorySchema;

try {
  // Use our local CommonJS version of storage for Netlify compatibility
  storage = require('./storage.js').storage;
  console.log('[netlify-function] Successfully loaded local storage module');
  
  // Import zod for validation
  z = require('zod');
  
  // Load schemas from our local compatibility module
  const schemas = require('./schema.js');
  insertProductSchema = schemas.insertProductSchema;
  insertCategorySchema = schemas.insertCategorySchema;
  console.log('[netlify-function] Successfully loaded schema definitions');
} catch (error) {
  console.error('[netlify-function] Error loading dependencies:', error);
  
  // Error recovery - load modules separately
  try {
    // Attempt to load storage again
    const localStorageBackup = require('./storage.js');
    storage = localStorageBackup.storage;
    console.log('[netlify-function] Successfully loaded storage from backup path');
    
    // Create fallback schemas if needed
    z = require('zod') || { 
      ZodError: class ZodError extends Error {},
      object: () => ({ parse: data => data }) 
    };
    
    // Load local schemas if possible
    const localSchemas = require('./schema.js');
    insertProductSchema = localSchemas.insertProductSchema;
    insertCategorySchema = localSchemas.insertCategorySchema;
    console.log('[netlify-function] Successfully loaded schemas from backup path');
  } catch (fallbackError) {
    console.error('[netlify-function] Critical error in fallback loading:', fallbackError);
    
    // Final fallback with minimal implementations
    z = { 
      ZodError: class ZodError extends Error {},
      object: () => ({ parse: data => data }) 
    };
    
    insertProductSchema = { parse: data => data };
    insertCategorySchema = { parse: data => data };
  }
}

// Log function to track API requests in Netlify Functions
const log = (message) => {
  console.log(`[netlify-function] ${message}`);
};

const app = express();

// Configure express app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS headers for Netlify functions
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// GET PRODUCTS
app.get("/api/products", async (req, res) => {
  try {
    const products = await storage.getAllProducts();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// GET PRODUCTS BY CATEGORY
app.get("/api/products/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    log(`Fetching products by category: ${category}`);
    const products = await storage.getProductsByCategory(category);
    res.json({ products });
  } catch (error) {
    log(`Error fetching products by category: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch products by category" });
  }
});

// SEARCH PRODUCTS
app.get("/api/products/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    log(`Searching products with query: ${query}`);
    if (!query || query.length < 2) {
      return res.status(400).json({ message: "Search query must be at least 2 characters" });
    }

    const products = await storage.searchProducts(query);
    res.json({ products });
  } catch (error) {
    log(`Error searching products: ${error.message}`);
    res.status(500).json({ message: "Failed to search products" });
  }
});

// GET PRODUCT BY ID (Place this after more specific routes)
app.get("/api/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    log(`Fetching product with ID: ${id}`);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await storage.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product });
  } catch (error) {
    log(`Error fetching product: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// GET ALL CATEGORIES
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await storage.getAllCategories();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// GET CATEGORY BY SLUG
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

// GET SITE SETTINGS
app.get("/api/admin/settings", async (req, res) => {
  try {
    const settings = await storage.getSiteSettings();
    res.json({ settings });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch site settings" });
  }
});

// UPDATE SITE SETTINGS
app.patch("/api/admin/settings", async (req, res) => {
  try {
    log(`Updating site settings: ${JSON.stringify(req.body)}`);
    const settingsUpdate = req.body;
    const updatedSettings = await storage.updateSiteSettings(settingsUpdate);
    res.json({ settings: updatedSettings });
  } catch (error) {
    log(`Error updating site settings: ${error.message}`);
    res.status(500).json({ message: "Failed to update site settings" });
  }
});

// GET HERO CAROUSEL SLIDES
app.get("/api/hero-carousel", async (req, res) => {
  try {
    const settings = await storage.getSiteSettings();
    res.json({ slides: settings.heroCarousel });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hero carousel slides" });
  }
});

// UPDATE HERO CAROUSEL SLIDES
app.patch("/api/admin/hero-carousel", async (req, res) => {
  try {
    log(`Updating hero carousel: ${JSON.stringify(req.body)}`);
    const carouselSlides = req.body.slides;
    if (!Array.isArray(carouselSlides)) {
      return res.status(400).json({ message: "Invalid data format. Expected array of slides" });
    }
    
    const settingsUpdate = { heroCarousel: carouselSlides };
    const updatedSettings = await storage.updateSiteSettings(settingsUpdate);
    res.json({ slides: updatedSettings.heroCarousel });
  } catch (error) {
    log(`Error updating hero carousel: ${error.message}`);
    res.status(500).json({ message: "Failed to update hero carousel slides" });
  }
});

// GET PAGE CONTENT
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

// UPDATE PAGE CONTENT
app.patch("/api/admin/pages/:page", async (req, res) => {
  try {
    const { page } = req.params;
    log(`Updating page content for ${page}: ${JSON.stringify(req.body)}`);
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
    log(`Error updating page content: ${error.message}`);
    res.status(500).json({ message: "Failed to update page content" });
  }
});

// UPDATE PRODUCT
app.patch("/api/admin/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    log(`Updating product ${id}: ${JSON.stringify(req.body)}`);
    
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
    log(`Error updating product: ${error.message}`);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// CREATE PRODUCT
app.post("/api/products", async (req, res) => {
  try {
    log(`Creating new product: ${JSON.stringify(req.body)}`);
    const validatedData = insertProductSchema.parse(req.body);
    const product = await storage.createProduct(validatedData);
    res.status(201).json({ product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      log(`Validation error creating product: ${JSON.stringify(error.errors)}`);
      res.status(400).json({ message: "Invalid product data", errors: error.errors });
    } else {
      log(`Error creating product: ${error.message}`);
      res.status(500).json({ message: "Failed to create product" });
    }
  }
});

// CREATE CATEGORY
app.post("/api/categories", async (req, res) => {
  try {
    log(`Creating new category: ${JSON.stringify(req.body)}`);
    const validatedData = insertCategorySchema.parse(req.body);
    const category = await storage.createCategory(validatedData);
    res.status(201).json({ category });
  } catch (error) {
    if (error instanceof z.ZodError) {
      log(`Validation error creating category: ${JSON.stringify(error.errors)}`);
      res.status(400).json({ message: "Invalid category data", errors: error.errors });
    } else {
      log(`Error creating category: ${error.message}`);
      res.status(500).json({ message: "Failed to create category" });
    }
  }
});

// Health check endpoints for Netlify function status verification
// Multiple paths to ensure one works
app.get("/.netlify/functions/api/health", (req, res) => {
  log("Health check endpoint accessed via /.netlify/functions/api/health");
  res.json({
    status: "ok",
    path: "/.netlify/functions/api/health",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  log("Health check endpoint accessed via /api/health");
  res.json({
    status: "ok",
    path: "/api/health",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  log("Health check endpoint accessed via /health");
  res.json({
    status: "ok",
    path: "/health",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

// Root function paths for debugging (multiple formats)
app.get("/.netlify/functions/api", (req, res) => {
  log("Root function path accessed via /.netlify/functions/api");
  res.json({
    message: "API function is running correctly",
    path: "/.netlify/functions/api",
    timestamp: new Date().toISOString(),
    routes: [
      "/api/products",
      "/api/categories",
      "/api/admin/settings",
      "/api/hero-carousel",
      "/api/pages/:page"
    ]
  });
});

// Root API path
app.get("/api", (req, res) => {
  log("Root API path accessed via /api");
  res.json({
    message: "API function is running correctly",
    path: "/api",
    timestamp: new Date().toISOString(),
    routes: [
      "/api/products",
      "/api/categories",
      "/api/admin/settings",
      "/api/hero-carousel",
      "/api/pages/:page"
    ]
  });
});

// Root path
app.get("/", (req, res) => {
  log("Root path accessed via /");
  res.json({
    message: "API function is running correctly",
    path: "/",
    timestamp: new Date().toISOString()
  });
});

// Fallback route handler for debugging purposes
app.use((req, res) => {
  log(`Unmatched route: ${req.method} ${req.path}`);
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
    availableEndpoints: [
      "GET /api/products",
      "GET /api/products/:id",
      "GET /api/products/category/:category",
      "GET /api/products/search/:query",
      "GET /api/categories",
      "GET /api/admin/settings",
      "GET /api/hero-carousel",
      "GET /api/pages/:page"
    ]
  });
});

// Export the handler function for Netlify Functions using CommonJS
// This is more compatible with Netlify's Node.js environment
module.exports = {
  handler: serverless(app)
};