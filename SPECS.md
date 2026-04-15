# The Earthy Touch Co. - Application Specifications

**Project Name:** The Earthy Touch Co.  
**Type:** E-Commerce Web Application  
**Framework:** Next.js 16.2.2  
**Status:** In Development

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture & Database](#architecture--database)
4. [Pages & Routes](#pages--routes)
5. [Core Features](#core-features)
6. [Components](#components)
7. [API Endpoints](#api-endpoints)
8. [Authentication](#authentication)
9. [State Management](#state-management)
10. [Styling & Design](#styling--design)

---

## Project Overview

**The Earthy Touch Co.** is a luxury e-commerce platform specializing in contemporary, thoughtfully designed home furnishings and decor. The platform provides:

- **Customer Experience:** Browse products, filter by categories, manage cart, and checkout
- **Admin Dashboard:** Manage products, categories, orders, and view business metrics
- **Multi-Currency Support:** Display prices in different currencies with real-time conversion
- **User Authentication:** Secure login/registration system with role-based access control

---

## Tech Stack

### Frontend
- **React:** 19.2.4 - UI library
- **Next.js:** 16.2.2 - Full-stack framework with App Router
- **TailwindCSS:** 4.0 - Utility-first CSS framework
- **Framer Motion:** 12.38.0 - Animation library
- **Lucide React:** 1.7.0 - Icon library

### Backend & Database
- **Next.js API Routes:** Server-side handlers
- **Prisma:** 7.7.0 - ORM for database management
- **PostgreSQL:** Database provider
- **NextAuth:** 5.0.0-beta.30 - Authentication system
- **bcryptjs:** 3.0.3 - Password hashing

### Development Tools
- **TypeScript:** 5.0 - Type safety
- **ESLint:** 9.0 - Code linting
- **PostCSS:** 4.0 - CSS processing

---

## Architecture & Database

### Database Schema

#### User Model
- **Fields:** id, email (unique), password, name, role, createdAt, updatedAt
- **Relations:** Has many Orders
- **Role Enum:** USER, ADMIN

#### Product Model
- **Fields:** id, name, slug (unique), description, price, compareAt, images (array), stock, featured, categoryId, createdAt, updatedAt
- **Relations:** Belongs to Category
- **Features:** Support for multiple images, price comparison, featured items toggle

#### Category Model
- **Fields:** id, name, slug (unique)
- **Relations:** Has many Products

#### Order Model
- **Fields:** id, userId, items (JSON), total, status, address (JSON), createdAt, updatedAt
- **Relations:** Belongs to User
- **OrderStatus Enum:** PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- **Storage:** Dynamic data stored as JSON for flexibility

---

## Pages & Routes

### Public Pages

#### 1. **Home Page** (`/`)
- **Path:** `app/page.tsx`
- **Features:**
  - Hero section showcasing brand
  - Featured products grid (up to 6 products)
  - Editorial sections with lifestyle imagery
  - Navigation links to category collections
  - Animated sections for visual engagement

#### 2. **Products Page** (`/products`)
- **Path:** `app/products/page.tsx`
- **Features:**
  - Product grid display
  - FilterSidebar for filtering by:
    - Category
    - Price range
    - Stock availability
  - SearchBar for product search
  - Search parameters: `?category=` support
  - Loading states and suspense boundaries
  - Responsive layout (mobile-optimized filter toggle)

#### 3. **Product Detail Page** (`/products/[slug]`)
- **Path:** `app/products/[slug]/page.tsx`
- **Features:**
  - Product image gallery
  - Detailed description
  - Price display with compare-at pricing
  - Stock information
  - Add to cart functionality
  - Related products suggestions
  - Client-side component: `ProductDetailClient.tsx`

#### 4. **Cart Page** (`/cart`)
- **Path:** `app/cart/page.tsx`
- **Features:**
  - Display cart items with images
  - Quantity management (increment/decrement)
  - Remove items from cart
  - Cart total calculation
  - Empty cart state message
  - Proceed to checkout button
  - Animated transitions

#### 5. **Checkout Page** (`/checkout`)
- **Path:** `app/checkout/page.tsx`
- **Features:**
  - Multi-step checkout (3 steps):
    1. **Address Step:** Billing/shipping address input
    2. **Payment Step:** Payment information
    3. **Confirm Step:** Order review and confirmation
  - Order creation
  - Session requirement (redirect to login if not authenticated)
  - Success confirmation with order ID
  - Cart clearing after order completion

#### 6. **Login Page** (`/login`)
- **Path:** `app/login/page.tsx`
- **Features:**
  - Email/password authentication
  - Form validation
  - Error handling
  - Link to registration page
  - Redirect to home on successful login

#### 7. **Register Page** (`/register`)
- **Path:** `app/register/page.tsx`
- **Features:**
  - User account creation
  - Email, password, name input
  - Password confirmation
  - Email validation
  - Automatic login after registration
  - Link to login page

#### 8. **Account Page** (`/account`)
- **Path:** `app/account/page.tsx`
- **Features:**
  - User profile information
  - Order history
  - Account settings
  - Logout functionality

#### 9. **Collections Page** (`/collections`)
- **Path:** `app/collections/page.tsx`
- **Features:**
  - Browse all product categories
  - Category cards/grid
  - Quick filtering by collection

### Admin Pages (Role-Protected)

#### 1. **Admin Dashboard** (`/admin`)
- **Path:** `app/admin/page.tsx`
- **Access:** ADMIN role only
- **Features:**
  - KPI dashboard showing:
    - Total products count
    - Total orders count
    - Total users count
    - Total categories count
    - Total revenue
  - Recent orders list (last 10)
  - Quick navigation to management sections

#### 2. **Admin Products** (`/admin/products`)
- **Path:** `app/admin/products/page.tsx`
- **Component:** `AdminProductsClient.tsx`
- **Features:**
  - Product list/table view
  - Add new product
  - Edit existing products
  - Delete products
  - Bulk actions (if implemented)

#### 3. **Admin Categories** (`/admin/categories`)
- **Path:** `app/admin/categories/page.tsx`
- **Component:** `AdminCategoriesClient.tsx`
- **Features:**
  - Category management
  - Add/edit/delete categories
  - Category-product relationship management

#### 4. **Admin Orders** (`/admin/orders`)
- **Path:** `app/admin/orders/page.tsx`
- **Component:** `AdminOrdersClient.tsx`
- **Features:**
  - Order list view
  - Order status updates (PENDING → PROCESSING → SHIPPED → DELIVERED)
  - Order details view
  - Customer information
  - Order filtering by status

---

## Core Features

### 1. **E-Commerce Functionality**
- Product browsing with multiple filters
- Shopping cart management (add, update, remove items)
- Checkout process with address entry
- Order creation and tracking
- Product stock management

### 2. **Authentication & Authorization**
- User registration with email/password
- Login/logout functionality
- Role-based access control (USER, ADMIN)
- Session management via NextAuth
- Protected admin routes

### 3. **Multi-Currency Support**
- USD base currency
- Support for multiple currencies
- Real-time price conversion
- Currency selector component
- Persistent currency preference

### 4. **Admin Management**
- Product CRUD operations
- Category management
- Order status tracking
- User management (view users)
- Dashboard metrics and analytics

### 5. **Product Management**
- Product SKU/slug system
- Multiple product images
- Price and compare-at pricing
- Stock inventory tracking
- Featured products flag
- Category associations

### 6. **UI/UX Enhancements**
- Animated page transitions
- Smooth component animations (Framer Motion)
- Responsive design (mobile-first)
- Dark/luxury aesthetic
- Accessibility features
- Loading states and suspense

---

## Components

### Layout Components
- **Navbar** - Main navigation with logo, menu, cart, auth links
- **Footer** - Footer with company info, links, social
- **CartDrawer** - Slide-out cart preview
- **Providers** - Context/Theme providers setup
- **Logo** - Brand logo component

### Shop Components
- **ProductCard** - Individual product display card
- **ProductGrid** - Grid layout for products
- **FilterSidebar** - Category and price filters
- **SearchBar** - Product search functionality
- **HeroSection** - Landing page hero content

### UI Components
- **Button** - Reusable button component
- **CurrencySelector** - Select currency dropdown/selector
- **AnimatedSection** - Section wrapper with animation
- **PageTransition** - Page-level transition animations

### Admin Components
- **AdminProductsClient** - Product management interface
- **AdminCategoriesClient** - Category management interface
- **AdminOrdersClient** - Order management interface

---

## API Endpoints

### Products API

#### `GET /api/products`
- **Query Params:** `?category=`, `?search=`, `?priceMin=`, `?priceMax=`
- **Returns:** Array of products matching filters
- **Features:** Filtering, search, pagination-ready

#### `POST /api/products`
- **Body:** Product data (name, price, description, images, stock, categoryId)
- **Auth:** Admin only
- **Returns:** Created product

#### `GET /api/products/[id]`
- **Returns:** Single product details

#### `PUT /api/products/[id]`
- **Auth:** Admin only
- **Returns:** Updated product

#### `DELETE /api/products/[id]`
- **Auth:** Admin only
- **Returns:** Success response

### Categories API

#### `GET /api/categories`
- **Returns:** All categories

#### `POST /api/categories`
- **Auth:** Admin only
- **Body:** Category data (name, slug)
- **Returns:** Created category

#### `GET /api/categories/[id]`
- **Returns:** Single category

#### `PUT /api/categories/[id]`
- **Auth:** Admin only
- **Returns:** Updated category

#### `DELETE /api/categories/[id]`
- **Auth:** Admin only
- **Returns:** Success response

### Orders API

#### `GET /api/orders`
- **Auth:** User/Admin
- **Returns:** Orders (admin sees all, users see own)

#### `POST /api/orders`
- **Auth:** Required
- **Body:** Items array, address, total
- **Returns:** Created order

#### `GET /api/orders/[id]`
- **Auth:** Required
- **Returns:** Order details

#### `PUT /api/orders/[id]`
- **Auth:** Admin only
- **Params:** status update
- **Returns:** Updated order

### Authentication API

#### `POST /api/auth/[...nextauth]`
- **Providers:** Credentials (email/password)
- **Session:** NextAuth sessions
- **Callbacks:** JWT, session management

#### `POST /api/register`
- **Body:** email, password, name
- **Returns:** User data or error

---

## Authentication

### System: NextAuth.js v5
- **Provider:** Credentials-based (email/password)
- **Storage:** Database sessions
- **Encryption:** bcryptjs for password hashing
- **Session Duration:** Configurable
- **Callbacks:** JWT and session callbacks for role management

### Protected Routes
- Admin pages require ADMIN role
- Checkout requires authenticated session
- Account page requires authentication

### Auth Flow
1. User registers via `/register`
2. Password hashed with bcryptjs
3. User logs in via `/login`
4. NextAuth creates session
5. Session includes user role
6. Role checked for admin access

---

## State Management

### Zustand Stores

#### **Cart Store** (`store/cart.ts`)
- **State:**
  - `items`: Cart item array
  - `selectedCurrency`: Current currency
- **Actions:**
  - `addItem(product)` - Add item to cart
  - `removeItem(productId)` - Remove item
  - `updateQuantity(productId, quantity)` - Update item quantity
  - `total()` - Calculate cart total
  - `clearCart()` - Empty cart

#### **Currency Store** (`store/currency.ts`)
- **State:**
  - `selectedCurrency`: Current currency
  - `exchangeRates`: Currency conversion rates
- **Actions:**
  - `setCurrency(currency)` - Change currency
  - `setExchangeRates(rates)` - Update exchange rates

### Hooks
- **`useCurrency()`** - Hook to access currency utilities and conversions
- **`useCartStore()`** - Hook to access cart state and actions

---

## Styling & Design

### Design System
- **Color Palette:** Dark/luxury aesthetic (#1a1a1a, #e2e2e2, #777777)
- **Typography:** Clean, minimal sans-serif (Geist font)
- **Spacing:** 4px base unit with TailwindCSS scale
- **Breakpoints:** Mobile-first responsive design

### Features
- **TailwindCSS v4** - Utility-first styling
- **PostCSS** - CSS processing and transformation
- **Animations** - Framer Motion for complex animations
- **Icons** - Lucide React icons throughout

### Pages Styling
- `globals.css` - Global styles
- `typography.css` - Typography utilities
- Component-level Tailwind classes

---

## Development Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio UI
```

---

## File Structure Summary

```
zenith-store/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Home page
│   ├── layout.tsx           # Root layout
│   ├── api/                 # API routes
│   ├── admin/               # Admin pages
│   ├── products/            # Product pages
│   ├── cart/                # Cart page
│   ├── checkout/            # Checkout page
│   ├── login/               # Login page
│   ├── register/            # Register page
│   └── account/             # Account page
├── components/              # Reusable components
│   ├── layout/             # Layout components
│   ├── shop/               # Shop components
│   └── ui/                 # UI components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
│   ├── auth.ts             # NextAuth config
│   ├── currency.ts         # Currency conversion
│   ├── prisma.ts           # Prisma client
│   └── utils.ts            # General utilities
├── store/                   # Zustand stores
│   ├── cart.ts             # Cart state
│   └── currency.ts         # Currency state
├── prisma/                 # Database
│   ├── schema.prisma       # Data models
│   └── seed.ts             # Database seeding
├── public/                 # Static assets
├── types/                  # TypeScript types
└── styles/                 # Global styles
```

---

## Deployment Considerations

- **Hosting:** Vercel-optimized (Next.js creators)
- **Database:** PostgreSQL recommended
- **Environment Variables:** AUTH secrets, database URL, currency API keys
- **Build:** `npm run build` creates optimized production build
- **Start:** `npm start` runs production server

---

## Future Enhancement Opportunities

- Email notifications (order confirmations, shipping updates)
- Payment gateway integration (Stripe, PayPal)
- Advanced analytics and reporting
- Product recommendations/ML
- Wishlist functionality
- Product reviews and ratings
- Inventory alerts
- Email marketing integration
- Customer support chat
- Mobile app version
- Advanced search with Elasticsearch
- CDN image optimization

---

*Last Updated: April 2026*
*Project: The Earthy Touch Co.*
