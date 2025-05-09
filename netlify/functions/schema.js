// CommonJS schema definitions for Netlify functions
// This provides a compatible layer to avoid ESM/CJS conflicts

// Import zod
const z = require('zod');

// Product schema
const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  categoryId: z.number(),
  inStock: z.boolean().default(true),
  rating: z.number().optional(),
  reviewCount: z.number().optional()
});

// Category schema
const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional()
});

// User schema
const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
  isAdmin: z.boolean().default(false)
});

// Insert schemas (without auto-generated fields)
const insertProductSchema = productSchema.omit({ id: true });
const insertCategorySchema = categorySchema.omit({ id: true });
const insertUserSchema = userSchema.omit({ id: true });

// Cart item schema
const cartItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().positive()
});

// Export schemas
module.exports = {
  productSchema,
  categorySchema,
  userSchema,
  insertProductSchema,
  insertCategorySchema,
  insertUserSchema,
  cartItemSchema,
  Product: class Product {},
  Category: class Category {},
  User: class User {},
  InsertProduct: class InsertProduct {},
  InsertCategory: class InsertCategory {},
  InsertUser: class InsertUser {},
  CartItem: class CartItem {}
};