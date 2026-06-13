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
- `pages/` - Route components (Home, About, Programs, Trainings, Events, News, Contact, Join, Opportunities)
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
- `opportunities` - Dynamic calls for tenders/opportunities (title, description, category, organization, deadline, location, link, isActive)
- `partners` - Partner organizations (name, description, logoUrl, websiteUrl, partnerType, isActive)
- `trainings` - Training programs from SADA and partners (title, description, provider, level, duration, link, isActive)
- `news_articles` - News and announcements (title, excerpt, content, category, author, publishedAt, imageUrl, isActive)
- `events` - Events and activities (title, description, date, time, location, type, registrationLink, isActive)
- `achievements` - Statistics/metrics (title, description, metricValue, metricLabel, icon, isActive)

### Content Architecture
- All pages are fully dynamic, fetching content from API endpoints
- Static organizational content (3 SAYC pillars, activities list, Smart Africa initiatives) is kept as constants in page components since it represents fixed organizational structure from SADA4Youth documentation
- All variable content (trainings, news, events, partners, achievements, opportunities) is database-backed for future dashboard management
- Empty states shown when no content is available in the database
- Loading skeletons displayed during data fetching

### SEO Implementation
- **robots.txt**: `client/public/robots.txt` - allows all crawlers, links to sitemap
- **sitemap.xml**: Dynamic route in `server/routes.ts` - auto-generates with all pages and current date
- **OG Image**: `client/public/images/og-image.png` - branded social sharing image (16:9)
- **Web Manifest**: `client/public/manifest.json` - PWA support with theme colors
- **Meta Tags**: Comprehensive meta tags in `client/index.html` (geo, author, robots, OG, Twitter Cards)
- **JSON-LD**: Organization and WebSite schemas in index.html, page-specific schemas via `SEOHead` component
- **SEOHead Component**: `client/src/components/SEOHead.tsx` - dynamically sets title, meta tags, canonical URL, breadcrumb JSON-LD per page
- **Canonical URLs**: All pages use absolute `https://sayctchad.org` URLs

### API Endpoints (GET)
- `/api/trainings` - Active training programs
- `/api/news` - Active news articles
- `/api/events` - Active events
- `/api/achievements` - Active achievements/stats
- `/api/partners` - Active partners
- `/api/opportunities` - Active opportunities

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