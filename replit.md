# Manasik Bayt Travel Platform

## Overview

A modern web platform for **Manasik Bayt Travel**, a travel agency specializing in spiritual journeys (Omra/Hajj), international tourism, group travel, and combined packages. The platform provides a luxury-oriented booking experience with multilingual support (French, Arabic, English), user dashboards, and a gamification system for customer loyalty.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state, React Context for global UI state (language)
- **Styling**: Tailwind CSS with CSS custom properties for theming, shadcn/ui component library (New York style)
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for hero sections and transitions
- **Design System**: Luxury spiritual theme with dark green primary, gold accents, and serif typography (Playfair Display, Inter, Amiri for Arabic)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript throughout
- **API Design**: REST API with typed route definitions in `shared/routes.ts` using Zod schemas
- **Authentication**: Replit Auth integration with OpenID Connect, session management via `express-session` with PostgreSQL store
- **Database**: PostgreSQL with Drizzle ORM for type-safe queries

### Data Storage
- **ORM**: Drizzle ORM with schema defined in `shared/schema.ts`
- **Tables**:
  - `users`: Customer accounts with gamification fields (points, levels)
  - `offers`: Travel packages (Omra, tourist, group, combo)
  - `bookings`: Reservation tracking with status workflow
  - `content`: Video content for guides and eSIM tutorials
  - `sessions`: Authentication session storage

### Authentication Flow
- Replit Auth provides OpenID Connect authentication
- Custom user table extends auth data with gamification (points, bronze/silver/gold/platinum levels)
- Session stored in PostgreSQL via `connect-pg-simple`
- `replitId` field links Replit auth identity to application user

### Project Structure
```
├── client/           # React frontend (Vite)
│   └── src/
│       ├── components/   # UI components (shadcn/ui + custom)
│       ├── pages/        # Route pages
│       ├── hooks/        # Data fetching hooks
│       └── lib/          # Utilities, i18n, query client
├── server/           # Express backend
│   ├── routes.ts     # API route registration
│   ├── storage.ts    # Database access layer
│   └── replit_integrations/  # Auth module
├── shared/           # Shared types and schemas
│   ├── schema.ts     # Drizzle table definitions
│   ├── routes.ts     # API route contracts
│   └── models/       # Auth-specific models
└── migrations/       # Drizzle migrations output
```

### Key Design Patterns
- **Monorepo structure**: Frontend, backend, and shared code in one repository
- **Type-safe API contracts**: Route definitions with Zod schemas shared between client and server
- **Storage abstraction**: `IStorage` interface allows swapping database implementations
- **Internationalization**: Context-based language switching with translations object

## External Dependencies

### Database
- **PostgreSQL**: Primary database, provisioned via Replit
- **Drizzle Kit**: Schema migrations via `db:push` command

### Authentication
- **Replit Auth**: OpenID Connect provider for user authentication
- **Passport.js**: Authentication middleware with OpenID Client strategy

### Third-Party Services
- **Google Fonts**: Inter, Playfair Display, Amiri fonts for typography
- **Unsplash**: External image hosting for hero backgrounds and offer images

### Key NPM Packages
- `drizzle-orm` / `drizzle-zod`: Database ORM and schema validation
- `@tanstack/react-query`: Server state management
- `framer-motion`: Animation library
- `react-hook-form` / `@hookform/resolvers`: Form handling
- `wouter`: Lightweight routing
- `lucide-react`: Icon library
- `date-fns`: Date formatting utilities