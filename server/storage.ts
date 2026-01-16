import {
  users, offers, bookings, content,
  type User, type InsertUser,
  type Offer, type InsertOffer,
  type Booking, type InsertBooking,
  type Content, type CreateBookingRequest,
  type UpdateBookingStatusRequest
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Auth & Users
  getUser(id: number): Promise<User | undefined>;
  getUserByReplitId(replitId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<User>;

  // Offers
  getOffers(filter?: { type?: string; featured?: boolean }): Promise<Offer[]>;
  getOffer(id: number): Promise<Offer | undefined>;
  createOffer(offer: InsertOffer): Promise<Offer>;

  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string): Promise<Booking>;

  // Content
  getContent(category?: string): Promise<Content[]>;
  createContent(item: typeof content.$inferInsert): Promise<Content>;
}

export class DatabaseStorage implements IStorage {
  // === USERS ===
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByReplitId(replitId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.replitId, replitId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserPoints(userId: number, points: number): Promise<User> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) throw new Error("User not found");

    // Simple level logic
    const newPoints = user.points + points;
    let newLevel = "bronze";
    if (newPoints > 500) newLevel = "silver";
    if (newPoints > 1000) newLevel = "gold";
    if (newPoints > 5000) newLevel = "platinum";

    const [updatedUser] = await db
      .update(users)
      .set({ points: newPoints, level: newLevel as any })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  // === OFFERS ===
  async getOffers(filter?: { type?: string; featured?: boolean }): Promise<Offer[]> {
    let query = db.select().from(offers);

    if (filter?.type) {
      query.where(eq(offers.type, filter.type as any));
    }
    if (filter?.featured) {
      query.where(eq(offers.isFeatured, true));
    }

    return await query.orderBy(desc(offers.createdAt));
  }

  async getOffer(id: number): Promise<Offer | undefined> {
    const [offer] = await db.select().from(offers).where(eq(offers.id, id));
    return offer;
  }

  async createOffer(insertOffer: InsertOffer): Promise<Offer> {
    const [offer] = await db.insert(offers).values(insertOffer).returning();
    return offer;
  }

  // === BOOKINGS ===
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(insertBooking).returning();
    return booking;
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.userId, userId)).orderBy(desc(bookings.createdAt));
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    const [booking] = await db
      .update(bookings)
      .set({ status: status as any })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  // === CONTENT ===
  async getContent(category?: string): Promise<Content[]> {
    if (category) {
      return await db.select().from(content).where(eq(content.category, category as any));
    }
    return await db.select().from(content);
  }

  async createContent(item: typeof content.$inferInsert): Promise<Content> {
    const [newItem] = await db.insert(content).values(item).returning();
    return newItem;
  }
}

export const storage = new DatabaseStorage();
