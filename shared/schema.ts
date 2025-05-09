import { pgTable, text, serial, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in Naira (smallest unit)
  oldPrice: integer("old_price"), // Optional previous price for discounts
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(), // Fashion, Skincare, Appliances, Utilities
  subCategory: text("sub_category"), // Men, Women, Kids, etc.
  isNew: boolean("is_new").default(false),
  isBestSeller: boolean("is_best_seller").default(false),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("review_count").default(0),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url"),
  parentId: integer("parent_id").references(() => categories.id),
});

// Users table (reusing the existing schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Create insert schema for each table
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Create types
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Type for cart items (client-side only)
export type CartItem = {
  productId: number;
  quantity: number;
};
