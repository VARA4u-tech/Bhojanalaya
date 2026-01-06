# Bhojanālaya Backend API

Express.js backend with TypeScript and Supabase for the Bhojanālaya restaurant platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Supabase account
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your Supabase credentials in `.env`:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
JWT_SECRET=your_secret_key
```

### Running the Server

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## 📚 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout

### Restaurants (`/api/restaurants`)
- `GET /` - List all restaurants
- `GET /:id` - Get restaurant details
- `POST /` - Create restaurant (admin)
- `PUT /:id` - Update restaurant (admin)
- `DELETE /:id` - Delete restaurant (admin)

### Menu (`/api/menu`)
- `GET /restaurant/:restaurantId` - Get restaurant menu
- `GET /item/:id` - Get menu item
- `POST /` - Create menu item (admin)
- `PUT /:id` - Update menu item (admin)
- `DELETE /:id` - Delete menu item (admin)

### Orders (`/api/orders`)
- `GET /` - Get user orders
- `GET /:id` - Get order details
- `POST /` - Create order
- `PUT /:id/status` - Update status (admin)
- `DELETE /:id` - Cancel order

### Bookings (`/api/bookings`)
- `GET /` - Get user bookings
- `POST /` - Create booking
- `PUT /:id` - Update booking
- `DELETE /:id` - Cancel booking

## 🗄️ Database Schema

See `docs/database-schema.sql` for the complete Supabase schema.

## 🔒 Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + JWT
- **Validation**: Zod

## 📝 License

MIT
