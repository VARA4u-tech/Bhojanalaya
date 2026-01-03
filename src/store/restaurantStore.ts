import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Restaurant {
    id: string;
    name: string;
    cuisine: string;
    description: string;
    image: string;
    rating: number;
    reviewCount: number;
    priceRange: string; // $, $$, $$$
    operatingHours: string;
    address: string;
    phone: string;
}

interface RestaurantState {
    restaurants: Restaurant[];
    selectedRestaurant: Restaurant | null;
    selectRestaurant: (restaurantId: string) => void;
    getRestaurantById: (restaurantId: string) => Restaurant | undefined;
    getMenuItemsByRestaurant: (restaurantId: string) => any[];
}

const restaurants: Restaurant[] = [
    {
        id: 'southern-spice',
        name: 'Southern Spice',
        cuisine: 'Andhra Cuisine',
        description: 'Iconic Vijayawada destination for authentic Andhra meals and the legendary Rayalaseema Biryani',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=400&fit=crop',
        rating: 4.8,
        reviewCount: 1240,
        priceRange: '₹₹₹',
        operatingHours: '12:00 PM - 11:00 PM',
        address: 'Minerva Grand, MG Road, Vijayawada',
        phone: '+91 866 667 7777',
    },
    {
        id: 'babai-hotel',
        name: 'Babai Hotel',
        cuisine: 'South Indian Breakfast',
        description: 'A historical landmark famous for its melting Idlis with white butter and aromatic Filter Coffee',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop',
        rating: 4.9,
        reviewCount: 2150,
        priceRange: '₹',
        operatingHours: '6:30 AM - 10:30 PM',
        address: 'Gandhinagar, Vijayawada',
        phone: '+91 866 257 1111',
    },
    {
        id: 'sweet-magic',
        name: 'Sweet Magic',
        cuisine: 'Sweets & Multi-Cuisine',
        description: 'The pulse of the city for delightful sweets, snacks, and traditional Vijayawada biryanis',
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&h=400&fit=crop',
        rating: 4.7,
        reviewCount: 3420,
        priceRange: '₹₹',
        operatingHours: '9:00 AM - 10:30 PM',
        address: 'MG Road & Benz Circle, Vijayawada',
        phone: '+91 866 247 2222',
    },
    {
        id: 'barkas-mandi',
        name: 'Barkas Mandi',
        cuisine: 'Arabian Mandi',
        description: 'Experience the finest Arabic-style Mandi with a local Vijayawada twist in an authentic setting',
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&h=400&fit=crop',
        rating: 4.6,
        reviewCount: 890,
        priceRange: '₹₹',
        operatingHours: '12:30 PM - 11:30 PM',
        address: 'Gurunanak Colony, Vijayawada',
        phone: '+91 866 333 4444',
    },
    {
        id: 'silver-spoon',
        name: 'Silver Spoon',
        cuisine: 'Multi-Cuisine Legacy',
        description: 'A legacy fine-dining restaurant serving Chinese, North Indian, and Local delicacies for decades',
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop',
        rating: 4.5,
        reviewCount: 1560,
        priceRange: '₹₹₹',
        operatingHours: '11:00 AM - 11:00 PM',
        address: 'Governorpet, Vijayawada',
        phone: '+91 866 257 5555',
    },
];

export const useRestaurantStore = create<RestaurantState>()(
    persist(
        (set, get) => ({
            restaurants,
            selectedRestaurant: restaurants[0], // Default to first restaurant

            selectRestaurant: (restaurantId) => {
                const restaurant = get().restaurants.find((r) => r.id === restaurantId);
                if (restaurant) {
                    set({ selectedRestaurant: restaurant });
                }
            },

            getRestaurantById: (restaurantId) => {
                return get().restaurants.find((r) => r.id === restaurantId);
            },

            getMenuItemsByRestaurant: (restaurantId) => {
                // Return a combined list of authentic Vijayawada dishes
                return [
                    { id: 1, name: 'Andhra Special Veg Thali', price: 280, category: 'main', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop' },
                    { id: 2, name: 'Rayalaseema Chicken Biryani', price: 350, category: 'main', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=400&fit=crop' },
                    { id: 201, name: 'Masala Majjiga (Spiced Buttermilk)', price: 60, category: 'drinks', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop' },
                    { id: 202, name: 'Fresh Lime Soda', price: 80, category: 'drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop' },
                    { id: 4, name: 'Pootharekulu (Paper Sweet)', price: 150, category: 'desserts', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop' },
                    { id: 204, name: 'Badam Milk (Hot)', price: 120, category: 'drinks', image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=400&h=400&fit=crop' },
                ] as any[];
            },
        }),
        {
            name: 'bhojanālaya-restaurant-storage',
        }
    )
);
