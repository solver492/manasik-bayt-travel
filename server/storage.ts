import {
  users, offers, bookings, content,
  type User, type InsertUser,
  type Offer, type InsertOffer,
  type Booking, type InsertBooking,
  type Content, type CreateBookingRequest,
  type UpdateBookingStatusRequest
} from "@shared/schema";
// import { db } from "./db"; // Removed to prevent DB connection requirement
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Auth & Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private offers: Map<number, Offer>;
  private bookings: Map<number, Booking>;
  private content: Map<number, Content>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.offers = new Map();
    this.bookings = new Map();
    this.content = new Map();
    this.currentId = 1;
  }

  // === USERS ===
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      points: 0,
      level: "bronze",
      createdAt: new Date(),
      email: insertUser.email || null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(userId: number, points: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const newPoints = user.points + points;
    let newLevel: "bronze" | "silver" | "gold" | "platinum" = "bronze";
    if (newPoints > 500) newLevel = "silver";
    if (newPoints > 1000) newLevel = "gold";
    if (newPoints > 5000) newLevel = "platinum";

    const updatedUser: User = { ...user, points: newPoints, level: newLevel };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // === OFFERS ===
  async getOffers(filter?: {
    type?: string;
    featured?: boolean;
  }): Promise<Offer[]> {
    let allOffers = Array.from(this.offers.values());

    if (filter?.type) {
      allOffers = allOffers.filter((o) => o.type === filter.type);
    }
    if (filter?.featured) {
      allOffers = allOffers.filter((o) => o.isFeatured === true);
    }

    // Sort desc by createdAt (simulated by id for now or date if available)
    return allOffers.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getOffer(id: number): Promise<Offer | undefined> {
    return this.offers.get(id);
  }

  async createOffer(insertOffer: InsertOffer): Promise<Offer> {
    const id = this.currentId++;
    const offer: Offer = {
      ...insertOffer,
      id,
      createdAt: new Date(),
    };
    this.offers.set(id, offer);
    return offer;
  }

  // === BOOKINGS ===
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentId++;
    const booking: Booking = {
      ...insertBooking,
      id,
      createdAt: new Date(),
      status: "pending", // Default status
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter((b) => b.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    const booking = this.bookings.get(id);
    if (!booking) throw new Error("Booking not found");
    const updated = { ...booking, status };
    this.bookings.set(id, updated);
    return updated;
  }

  // === CONTENT ===
  async getContent(category?: string): Promise<Content[]> {
    let items = Array.from(this.content.values());
    if (category) {
      items = items.filter((c) => c.category === category);
    }
    return items;
  }

  async createContent(item: typeof content.$inferInsert): Promise<Content> {
    const id = this.currentId++;
    const newItem: Content = { ...item, id, createdAt: new Date() };
    this.content.set(id, newItem);
    return newItem;
  }
}

export const storage = new MemStorage();
