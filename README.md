# Aori Restaurant Web App

A mobile-first Progressive Web App (PWA) for Aori Greek street food restaurant, built with Next.js 14, TypeScript, and Tailwind CSS. Features Uber Eats-style ordering experience with EPOS Now POS integration.

## Features

- 🥙 **Mobile-First Design** - Optimized for mobile ordering experience
- 📱 **Progressive Web App** - Installable, offline-capable with push notifications
- 🛒 **Smart Cart System** - Persistent cart with Zustand state management
- ⏱️ **Dynamic Time Estimation** - Intelligent collection time based on kitchen load
- 🎯 **EPOS Now Integration** - Real-time order management and POS synchronization
- 🔍 **Menu Search** - Fast search with predictive text
- 📊 **Real-time Status** - Live order tracking and kitchen status
- ♿ **Accessibility** - WCAG 2.1 AA compliant with screen reader support

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS (mobile-first approach)
- **State Management**: Zustand for cart, React Query for server state
- **PWA**: next-pwa for Progressive Web App features
- **POS Integration**: EPOS Now REST API v4
- **Payment**: Stripe integration ready
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- EPOS Now API credentials (for production)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/aori-restaurant.git
cd aori-restaurant
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
EPOS_NOW_API_KEY=your_api_key
EPOS_NOW_API_SECRET=your_api_secret
EPOS_NOW_BASE_URL=https://api.eposnowhq.com
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Restaurant Details

**Aori Greek Street Food**
- Address: 78 Old Mill St, Manchester M4 6LW  
- Phone: +44 123 456 7890
- Hours: Mon-Thu 11:00-22:00, Fri-Sat 11:00-23:00, Sun 12:00-21:00

## Key Features Implemented

### 🏠 Home Page
- Hero section with Greek branding
- Quick access buttons for ordering
- Restaurant information and hours
- Popular items preview
- QR code section for table ordering

### 📋 Menu System  
- Category-based navigation with horizontal scrolling tabs
- Search functionality with real-time filtering
- Item cards with variants (Wrap/Box Meal options)
- Allergen information display
- Quick add buttons with variant selection

### 🛒 Shopping Cart
- Persistent cart using Zustand state management
- Slide-up cart drawer with touch gestures
- Quantity adjustment with +/- buttons
- Item removal with confirmation
- Real-time total calculation

### 💳 Checkout Flow
- Customer details form with validation
- Collection time selection (ASAP or scheduled)
- Dynamic time estimation based on kitchen load
- Payment method selection (online/at restaurant)
- Order summary with itemized pricing

### 📱 Progressive Web App
- Service worker for offline functionality
- Web app manifest for installability
- Mobile-optimized touch targets (48px minimum)
- Safe area padding for modern mobile devices
- App-like navigation and animations

### 🔌 EPOS Now Integration
- Real-time order creation in POS system
- Kitchen load monitoring for time estimation
- Order status tracking and updates
- Webhook support for real-time notifications
- Intelligent queue management

## Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── orders/        # Order creation and status
│   │   └── kitchen-status/ # Kitchen load monitoring
│   ├── checkout/          # Checkout flow
│   ├── menu/             # Menu browsing
│   └── order-confirmation/ # Order confirmation
├── components/            # Reusable UI components
├── data/                 # Menu items and restaurant info
├── lib/                  # EPOS Now API integration
├── stores/               # Zustand state management
└── types/                # TypeScript definitions
```

## Deployment

This project is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard  
3. Deploy automatically on push to main branch

For manual deployment:
```bash
npm run build
npm start
```

## License

This project is licensed under the MIT License.
