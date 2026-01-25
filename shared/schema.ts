import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Users table with Gamification and Social Auth fields
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique(), // Optional if using email
  password: text("password"), // Hash stored for local login, null for social
  email: text("email").unique().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  role: text("role", { enum: ["client", "agent", "admin"] }).default("client").notNull(),

  // Social Auth IDs
  googleId: text("google_id"),
  facebookId: text("facebook_id"),

  // Gamification
  points: integer("points").default(0).notNull(),
  level: text("level", { enum: ["bronze", "silver", "gold", "platinum"] }).default("bronze").notNull(),
  language: text("language", { enum: ["fr", "ar", "en"] }).default("fr").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

// Session Store (for connect-pg-simple)
export const session = pgTable("session", {
  sid: text("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Travel Offers
export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  type: text("type", { enum: ["manasik", "touristique", "organise", "pack", "hotel", "car_rental"] }).notNull(),
  subtype: text("subtype"), // e.g., 'omra', 'hajj'
  description: text("description").notNull(),
  program: jsonb("program").$type<Array<{ day: number, title: string, desc: string }>>().notNull(),
  price: integer("price").notNull(), // In base currency (e.g., MAD or EUR cents)
  currency: text("currency").default("MAD").notNull(),
  durationDays: integer("duration_days").notNull(),
  imageUrl: text("image_url").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bookings
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Link to registered user
  offerId: integer("offer_id").references(() => offers.id),
  status: text("status", { enum: ["pending", "confirmed", "cancelled", "completed"] }).default("pending").notNull(),
  travelersCount: integer("travelers_count").default(1).notNull(),
  totalPrice: integer("total_price").notNull(),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Video Content (eSIM, Guides)
export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category", { enum: ["esim", "guide", "general"] }).notNull(),
  videoUrl: text("video_url").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, points: true, level: true });
export const insertOfferSchema = createInsertSchema(offers).omit({ id: true, createdAt: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true, status: true });
export const insertContentSchema = createInsertSchema(content).omit({ id: true, createdAt: true });

// === TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Offer = typeof offers.$inferSelect;
export type InsertOffer = z.infer<typeof insertOfferSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Content = typeof content.$inferSelect;

// === API CONTRACT TYPES ===

export type CreateBookingRequest = InsertBooking;
export type UpdateBookingStatusRequest = { status: Booking["status"] };

export interface OfferFilterParams {
  type?: Offer["type"];
  minPrice?: number;
  maxPrice?: number;
}
