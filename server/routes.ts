import type { Express } from "express";
import type { Server } from "http";
import { setupAuth, isAuthenticated } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

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
    const user = await storage.getUser((req.user as any).id);
    res.json(user || null);
  });

  // Local Login
  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);

    // Simple password check for prototype
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: "Erreur de session" });
      res.json(user);
    });
  });

  // Local Register
  app.post("/api/register", async (req, res) => {
    const { username, email, password, firstName, lastName, phone } = req.body;

    const existing = await storage.getUserByUsername(username) || await storage.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Cet utilisateur ou email existe déjà" });
    }

    const user = await storage.createUser({
      username,
      email,
      password, // In real app, hash this!
      firstName,
      lastName,
      phone,
      role: "client",
      language: "fr"
    });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: "Erreur de session" });
      res.json(user);
    });
  });

  // Logout
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Erreur lors de la déconnexion" });
      res.json({ message: "Déconnexion réussie" });
    });
  });

  function isAdmin(req: any, res: any, next: any) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: "Accès refusé" });
  }

  // === ADMIN ROUTES ===
  app.get("/api/admin/clients", isAdmin, async (req, res) => {
    const clients = await storage.getClients();
    res.json(clients);
  });

  app.get("/api/admin/bookings", isAdmin, async (req, res) => {
    const bookings = await storage.getAllBookings();
    res.json(bookings);
  });

  app.post("/api/admin/offers", isAdmin, async (req, res) => {
    try {
      const input = api.offers.create.input.parse(req.body);
      const offer = await storage.createOffer(input);
      res.status(201).json(offer);
    } catch (e: any) {
      res.status(400).json({ message: e.message || "Invalid input" });
    }
  });

  app.patch("/api/admin/offers/:id", isAdmin, async (req, res) => {
    try {
      const offer = await storage.updateOffer(Number(req.params.id), req.body);
      res.json(offer);
    } catch (e: any) {
      res.status(400).json({ message: "Error updating offer" });
    }
  });

  app.delete("/api/admin/offers/:id", isAdmin, async (req, res) => {
    await storage.deleteOffer(Number(req.params.id));
    res.status(204).end();
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

  // Public Create Offer commented out - use Admin Create
  // app.post(api.offers.create.path, async (req, res) => {
  //   // Only admins should create offers (skipped auth check for simplicity in prototype)
  //   try {
  //     const input = api.offers.create.input.parse(req.body);
  //     const offer = await storage.createOffer(input);
  //     res.status(201).json(offer);
  //   } catch (e) {
  //     res.status(400).json({ message: "Invalid input" });
  //   }
  // });

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
    const user = await storage.getUser((req.user as any).id);
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

    // NEW SERVICES: Flights, Hotels, Cars, Yachts
    await storage.createOffer({
      title: "Billets d'avion au meilleur prix",
      slug: "vols-competitifs",
      type: "pack",
      description: "Réservation de billets d'avion vers toutes les destinations avec des prix défiant toute concurrence.",
      program: [{ day: 1, title: "Recherche & Réservation", desc: "Accompagnement personnalisé pour trouver le meilleur vol." }],
      price: 1500,
      currency: "MAD",
      durationDays: 1,
      imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=2070&auto=format&fit=crop",
      isFeatured: true
    });

    await storage.createOffer({
      title: "Hôtels de luxe & Charme",
      slug: "hotels-selection",
      type: "pack",
      description: "Une sélection d'hôtels prestigieux pour tous vos séjours, affaires ou loisirs.",
      program: [{ day: 1, title: "Sélection sur mesure", desc: "Nous choisissons l'hôtel idéal selon vos critères." }],
      price: 800,
      currency: "MAD",
      durationDays: 1,
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
      isFeatured: true
    });

    await storage.createOffer({
      title: "Location de Voitures & Yachts",
      slug: "location-luxe",
      type: "pack",
      description: "Déplacez-vous avec style. Location de voitures de luxe et yachts privés pour vos escapades.",
      program: [{ day: 1, title: "Liberté totale", desc: "Réservation rapide et suivi personnalisé." }],
      price: 2500,
      currency: "MAD",
      durationDays: 1,
      imageUrl: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2070&auto=format&fit=crop",
      isFeatured: true
    });

    // BUSINESS & ADVENTURE ACCOMPANIMENT
    await storage.createOffer({
      title: "Voyages d'Affaires & Aventures",
      slug: "accompagnement-premium",
      type: "organise",
      description: "Accompagnement complet pour vos voyages d'affaires, séjours loisirs et aventures avec suivi à chaque étape.",
      program: [{ day: 1, title: "Planification", desc: "Organisation rigoureuse de votre itinéraire." }],
      price: 5000,
      currency: "MAD",
      durationDays: 1,
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop",
      isFeatured: true
    });
  }

  const content = await storage.getContent();
  if (content.length === 0) {
    await storage.createContent({
      title: "Restez connecté avec l'eSIM",
      category: "esim",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Évitez les frais d'itinérance lors de vos voyages grâce à l'eSIM. Découvrez comment rester connecté partout dans le monde."
    });
    await storage.createContent({
      title: "Comment activer votre eSIM ?",
      category: "esim",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Tutoriel rapide pour activer votre eSIM en quelques minutes."
    });
    await storage.createContent({
      title: "Guide du Pèlerin: Ihram",
      category: "guide",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Les étapes essentielles de l'Ihram pour un pèlerinage réussi."
    });
  }
}
