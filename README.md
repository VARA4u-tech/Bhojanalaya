# <div align="center"><img src="frontend/public/brand/logo.png" width="100" height="100" alt="Bhojanālaya Logo"><br>Bhojanālaya Direct</div>

<div align="center">
  <h3>🌿 Premium Organic Dining • Instant Reservations • Seamless Ordering 🌿</h3>
  <p><i>Empowering the next generation of dining technology with elegance and speed.</i></p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
</p>

---

## 📖 Introduction

**Bhojanālaya Direct** is a high-fidelity, full-stack digital solution for the modern organic restaurant ecosystem. It bridges the gap between traditional farm-to-table dining and modern convenience through a **Mobile-First, Poster-Style UX**. Featuring a streamlined **Google Authentication** flow and a dedicated **User Dashboard**, it offers diners a premium way to browse menus, book tables, and track orders in real-time.

---

## ✨ Key Features & Recent Updates

### 🚀 Streamlined Authentication (New!)
- **Google-Only Auth**: Zero-friction login and signup. No more passwords to remember.
- **Attractive Poster UX**: Beautifully illustrated authentication views with high-fidelity organic SVG icons.
- **One-Tap Access**: Secure, instant entry to the Bhojanālaya community.

### 📊 User Dashboard
- **Centralized View**: Orders, bookings, and profile preferences managed in one elegant workspace.
- **Real-Time Tracking**: Monitor your meal from the kitchen to your table.
- **Legacy Support**: Automatic redirection from `/profile` to ensured seamless transition.

### 🍱 Premium Dining Experience
- **Smart Menu**: Advanced filtering by cuisine, dietary needs, and price.
- **Instant Booking**: Real-time table availability and capacity management.
- **Glassmorphism UI**: High-end aesthetic with buttery-smooth **Framer Motion** animations.

---

## 🛠️ Technology Stack

| Category | Tools & Technologies |
| :--- | :--- |
| **Frontend Core** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, Lucide Icons, Shadcn UI |
| **State Management** | Zustand (Global), React Query (SVR) |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database & Auth** | Supabase (PostgreSQL), Google OAuth |
| **Animations** | Framer Motion (Transitions & Micro-interactions) |
| **Real-time** | Socket.io / WebSockets |

---

## 🏗️ Architecture Overview

The project is split into two main modules, maintaining a strict separation of concerns for scalability and performance.

```bash
bitebook-direct/
├── frontend/          # Vite-powered SPA
│   ├── src/           # ⚛️ Components, Hooks, Store, Pages
│   ├── components/    # 🧱 Reusable UI (Shadcn + Framer)
│   └── store/         # 🧠 Zustand Auth & Data Stores
├── backend/           # Express.js API
│   ├── src/           # ⚙️ Controllers, Routes, Middleware
│   └── lib/           # 🛠️ Supabase & Utility clients
└── .github/           # 🤖 CI/CD Workflows
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Supabase Project (Database + Google Auth enabled)

### 2. Frontend Installation
```bash
cd frontend
npm install
npm run dev
```
> Access at: `http://localhost:8080`

### 3. Backend Installation
```bash
cd backend
npm install
# Configure your .env (SUPABASE_URL, SUPABASE_ANON_KEY, etc.)
npm run dev
```
> Access at: `http://localhost:3000`

---

## 🎨 Design Philosophy

- **Organic & Earthy**: A color palette inspired by nature (Deep Greens, Soft Creams, Vibrant Oranges).
- **Tactile Feedback**: Every interaction provides subtle visual feedback (Hover glows, scale-up clicks).
- **Accessibility**: Built on **Radix UI** primitives to ensure dining technology is usable by everyone.
- **Performance**: SEO optimized and fast-loading through asset minification and efficient state purging.

---

<div align="center">
  <p><b>Crafted with ❤️ for Premium Dining</b></p>
  <p>Copyright © 2026 Bhojanālaya Direct • <a href="https://github.com/VARA4u-tech">VARA4u-tech</a></p>
</div>
