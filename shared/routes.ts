import { z } from 'zod';
import { insertOfferSchema, insertBookingSchema, offers, bookings, content } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
      responses: {
        200: z.object({
          id: z.number(),
          username: z.string(),
          role: z.enum(["client", "agent", "admin"]),
          points: z.number(),
          level: z.string(),
          language: z.string()
        }).nullable(),
      },
    },
  },
  offers: {
    list: {
      method: 'GET' as const,
      path: '/api/offers',
      input: z.object({
        type: z.enum(["manasik", "touristique", "organise", "pack"]).optional(),
        featured: z.boolean().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof offers.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/offers/:id',
      responses: {
        200: z.custom<typeof offers.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/offers',
      input: insertOfferSchema,
      responses: {
        201: z.custom<typeof offers.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  bookings: {
    create: {
      method: 'POST' as const,
      path: '/api/bookings',
      input: insertBookingSchema,
      responses: {
        201: z.custom<typeof bookings.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.internal, // Unauthorized
      },
    },
    listMyBookings: {
      method: 'GET' as const,
      path: '/api/bookings/my',
      responses: {
        200: z.array(z.custom<typeof bookings.$inferSelect>()),
      },
    },
  },
  content: {
    list: {
      method: 'GET' as const,
      path: '/api/content',
      input: z.object({ category: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof content.$inferSelect>()),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
