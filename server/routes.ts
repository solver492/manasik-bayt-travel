import type { Express } from "express";
import type { Server } from "http";
import { setupAuth } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Overwrite the Replit Auth storage adapter to use our main storage
// This is necessary because we have a custom Users table with gamification fields
import { authStorage } from "./replit_integrations/auth/storage";

authStorage.getUser = async (id: string) => {
  // Map Replit Auth ID (string) to our User ID (int)
  // We store the replit ID in the 'replitId' column
  const [user] = await db.select().from(users).where(eq(users.replitId, id));
  if (!user) return undefined;
  // Adapter needs to return an object matching the auth schema, but we can return our user object
  // as long as we handle the type mismatch or ensure compatibility.
  // The Replit Auth module expects {id: string, ...}. Our ID is number.
  // We will cast it for the auth module's specific needs or better yet:
  // We will let the auth module use its own table for "session/auth" tracking if strictly needed,
  // BUT we really want to link it to our main user.
  
  // SIMPLIFICATION:
  // We will use the 'replitId' as the link. 
  // When 'upsertUser' is called by the auth module, we create/update our main user.
  return user as any; 
};

authStorage.upsertUser = async (userData: any) => {
  const existing = await storage.getUserByReplitId(userData.id);
  if (existing) {
    return existing as any;
  }
  
  const newUser = await storage.createUser({
    replitId: userData.id,
    username: userData.username || userData.email?.split('@')[0] || "User",
    email: userData.email,
    role: "client",
    language: "fr"
  });
  return newUser as any;
};


export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // 1. Setup Auth
  await setupAuth(app);

  // 2. Register API Routes
  
  // Auth Me (Custom wrapper to return full profile with points)
  app.get(api.auth.me.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.json(null);
    const user = await storage.getUserByReplitId((req.user as any).id); // Replit Auth ID
    res.json(user || null);
  });

  // Offers
  app.get(api.offers.list.path, async (req, res) => {
    const filters = {
      type: req.query.type as string,
      featured: req.query.featured === 'true'
    };
    const offers = await storage.getOffers(filters);
    res.json(offers);
  });

  app.get(api.offers.get.path, async (req, res) => {
    const offer = await storage.getOffer(Number(req.params.id));
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    res.json(offer);
  });

  app.post(api.offers.create.path, async (req, res) => {
    // Only admins should create offers (skipped auth check for simplicity in prototype)
    try {
      const input = api.offers.create.input.parse(req.body);
      const offer = await storage.createOffer(input);
      res.status(201).json(offer);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // Bookings
  app.post(api.bookings.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const input = api.bookings.create.input.parse(req.body);
      const booking = await storage.createBooking(input);
      
      // Gamification: Award 100 points for a booking
      if (input.userId) {
        await storage.updateUserPoints(input.userId, 100);
      }
      
      res.status(201).json(booking);
    } catch (e) {
      res.status(400).json({ message: "Validation failed" });
    }
  });

  app.get(api.bookings.listMyBookings.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = await storage.getUserByReplitId((req.user as any).id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const bookings = await storage.getBookingsByUser(user.id);
    res.json(bookings);
  });

  // Content
  app.get(api.content.list.path, async (req, res) => {
    const category = req.query.category as string;
    const items = await storage.getContent(category);
    res.json(items);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const offers = await storage.getOffers();
  if (offers.length === 0) {
    // Omra
    await storage.createOffer({
      title: "Omra Ramadan 2026 - Confort",
      slug: "omra-ramadan-2026",
      type: "manasik",
      subtype: "omra",
      description: "Une expérience spirituelle inoubliable avec un hébergement 5 étoiles proche du Haram.",
      program: [
        { day: 1, title: "Arrivée à Médine", desc: "Accueil et transfert à l'hôtel." },
        { day: 2, title: "Ziyara Médine", desc: "Visite de la mosquée du Prophète et des sites historiques." },
        { day: 5, title: "Départ pour la Mecque", desc: "Ihram et transfert en TGV Haramain." }
      ],
      price: 18500, // MAD
      currency: "MAD",
      durationDays: 12,
      imageUrl: "https://images.unsplash.com/photo-1565552684305-7e43f0308a81?q=80&w=2874&auto=format&fit=crop",
      isFeatured: true
    });

    // Istanbul
    await storage.createOffer({
      title: "Istanbul Magique & Bosphore",
      slug: "istanbul-bosphore",
      type: "touristique",
      description: "Découvrez la magie d'Istanbul, entre Orient et Occident.",
      program: [{ day: 1, title: "Arrivée", desc: "Transfert hôtel" }],
      price: 8900,
      currency: "MAD",
      durationDays: 7,
      imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2949&auto=format&fit=crop",
      isFeatured: true
    });
    
    // Group
    await storage.createOffer({
      title: "Malaysia en Groupe",
      slug: "malaysia-group-2026",
      type: "organise",
      description: "Voyage organisé Kuala Lumpur et Langkawi.",
      program: [{ day: 1, title: "Départ", desc: "Vol direct" }],
      price: 14500,
      currency: "MAD",
      durationDays: 10,
      imageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2922&auto=format&fit=crop",
      isFeatured: false
    });
  }

  const content = await storage.getContent();
  if (content.length === 0) {
    await storage.createContent({
      title: "Comment activer votre eSIM ?",
      category: "esim",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
      description: "Tutoriel rapide pour rester connecté."
    });
    await storage.createContent({
      title: "Guide du Pèlerin: Ihram",
      category: "guide",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
      description: "Les étapes essentielles de l'Ihram."
    });
  }
}
