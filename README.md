# Bhojanālaya - Restaurant Ordering Platform

A modern, full-stack restaurant ordering and table booking platform built for Vijayawada's finest dining establishments.

## 🏗️ Project Structure

```
bitebook-direct/
├── frontend/          # React + Vite frontend application
│   ├── src/          # React components, pages, and logic
│   ├── public/       # Static assets
│   └── ...           # Frontend configs and dependencies
├── backend/          # Express.js + TypeScript backend API
│   ├── src/          # API routes, controllers, middleware
│   ├── database-schema.sql  # Supabase database schema
│   └── ...           # Backend configs and dependencies
└── README.md         # This file
```

## 🚀 Getting Started

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:8080`

### Backend Development

```bash
cd backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

npm run dev
```

The API will be available at `http://localhost:3000`

### Build for Production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
npm start
```

## ✨ Features

- **Multi-Restaurant Support**: Browse and order from multiple restaurants
- **Real-Time Order Tracking**: Track your order status in real-time
- **Table Booking**: Reserve tables in advance
- **Smart Menu Filtering**: Filter by cuisine, dietary preferences, and more
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Premium UI/UX**: Glassmorphism design with smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Router** - Navigation
- **Radix UI** - Accessible components

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Supabase** - Database, Auth, Storage
- **Zod** - Validation
- **JWT** - Authentication tokens

## 📱 Key Pages

- **Home** - Hero section with restaurant showcase
- **Menu** - Browse dishes with advanced filtering
- **Orders** - Track order status and history
- **Booking** - Reserve tables
- **Profile** - User account management

## 🎨 Design Highlights

- Iconic lotus branding
- Mobile-optimized responsive layouts
- Tactile touch interactions
- Smooth page transitions
- Premium glassmorphism aesthetic

## 👨‍💻 Development

This project was developed with a focus on:
- SEO-friendly semantic HTML
- Accessibility (WCAG compliance)
- Performance optimization
- Mobile-first responsive design
- Clean, maintainable code architecture

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Developed by**: VARA4u-tech  
**Repository**: [github.com/VARA4u-tech/bitebook-direct](https://github.com/VARA4u-tech/bitebook-direct)
