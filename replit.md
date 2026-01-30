# SAYC Tchad - Smart Africa Youth Chapter

## Overview

This is the official website for Smart Africa Youth Chapter Tchad (SAYC Tchad), a platform dedicated to African youth aged 15-35 focused on education, collaboration, and digital innovation. The site serves as the national chapter's online presence for recruiting members, showcasing programs and trainings, publishing news and events, and centralizing resources for young people interested in technology and leadership.

The application follows a full-stack architecture with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

The frontend is organized in `client/src/` with:
- `pages/` - Route components (Home, About, Programs, Trainings, Events, News, Contact, Join)
- `components/ui/` - Reusable shadcn/ui components
- `components/layout/` - Header and Footer components
- `hooks/` - Custom React hooks
- `lib/` - Utilities and query client configuration

### Backend Architecture
- **Framework**: Express 5 on Node.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints under `/api/` prefix
- **Build**: esbuild for production bundling

The server handles:
- Member registration (`POST /api/members`)
- Contact form submissions (`POST /api/contact`)
- Newsletter subscriptions (`POST /api/newsletter`)
- Static file serving in production

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for validation
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Migrations**: `migrations/` directory managed by drizzle-kit

Database tables:
- `users` - Basic authentication (id, username, password)
- `members` - Member registrations with demographics and interests
- `contact_messages` - Contact form submissions
- `newsletter_subscribers` - Email subscriptions

### Shared Code
The `shared/` directory contains schema definitions and types used by both frontend and backend, ensuring type safety across the stack.

### Development vs Production
- **Development**: Vite dev server with HMR, proxied through Express
- **Production**: Static files served from `dist/public/`, server bundled to `dist/index.cjs`

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI Libraries
- **Radix UI**: Headless component primitives (dialog, dropdown, tabs, etc.)
- **Lucide React**: Icon library
- **react-icons**: Additional social media icons
- **embla-carousel-react**: Carousel component
- **react-day-picker**: Date picker for calendar functionality
- **cmdk**: Command palette component
- **vaul**: Drawer component

### Form & Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **Zod**: Schema validation (shared with drizzle-zod)

### Build & Development
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Server bundling for production
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS/Autoprefixer**: CSS processing

### Fonts
- **Google Fonts**: Poppins and Inter font families loaded via CDN