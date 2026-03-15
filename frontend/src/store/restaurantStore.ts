import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export interface Restaurant {
    id: string;
    name: string;
    cuisine: string;
    description: string;
    image: string;
    rating: number;
    reviewCount: number;
    priceRange: string;
    operatingHours: string;
    address: string;
    phone: string;
}

export interface MenuItem {
    id: string | number;
    name: string;
    description?: string;
    price: number;
    category: string;
    image: string;
    restaurant_id?: string;
    is_veg?: boolean;
    available?: boolean;
}

interface DBRestaurant {
    id: string;
    name: string;
    cuisine: string;
    description: string;
    image: string;
    rating: string;
    review_count: number;
    price_range: string;
    operating_hours: string;
    address: string;
    phone: string;
}

interface DBMenuItem {
    id: number;
    name: string;
    price: string;
    category: string;
    image: string;
    restaurant_id: string;
}

interface RestaurantState {
    restaurants: Restaurant[];
    selectedRestaurant: Restaurant | null;
    isLoading: boolean;
    fetchRestaurants: () => Promise<void>;
    selectRestaurant: (restaurantId: string) => void;
    getRestaurantById: (restaurantId: string) => Restaurant | undefined;
    getMenuItemsByRestaurant: (restaurantId: string) => Promise<MenuItem[]>;
}

export const useRestaurantStore = create<RestaurantState>()(
    persist(
        (set, get) => ({
            restaurants: [
                {
                    id: 'southern-spice',
                    name: 'Southern Spice',
                    cuisine: 'Andhra Cuisine',
                    description: 'Iconic Vijayawada destination for authentic Andhra meals and the legendary Rayalaseema Biryani',
                    image: 'https://b.zmtcdn.com/data/pictures/5/18697395/dbc49b9c99c186f5f185dcf8f9a5141b.jpg?fit=around%7C960%3A500',
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
                    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=500&fit=crop&q=80',
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
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop&q=80',
                    rating: 4.7,
                    reviewCount: 3420,
                    priceRange: '₹₹',
                    operatingHours: '9:00 AM - 10:30 PM',
                    address: 'MG Road & Benz Circle, Vijayawada',
                    phone: '+91 866 247 2222',
                }
            ],
            selectedRestaurant: null,
            isLoading: false,

            fetchRestaurants: async () => {
                set({ isLoading: true });
                const { data, error } = await supabase
                    .from('restaurants')
                    .select('*');

                if (!error && data && data.length > 0) {
                    const mapped: Restaurant[] = (data as DBRestaurant[]).map((r) => ({
                        id: r.id,
                        name: r.name,
                        cuisine: r.cuisine,
                        description: r.description,
                        image: r.image,
                        rating: parseFloat(r.rating),
                        reviewCount: r.review_count || 0,
                        priceRange: r.price_range || '₹₹',
                        operatingHours: r.operating_hours || '10:00 AM - 10:00 PM',
                        address: r.address,
                        phone: r.phone
                    }));
                    set({ restaurants: mapped, isLoading: false });
                } else {
                    // Keep the existing static data if DB is empty or error occurs
                    if (error) console.error("Error fetching restaurants:", error);
                    set({ isLoading: false });
                }
            },

            selectRestaurant: (restaurantId) => {
                const restaurant = get().restaurants.find((r) => r.id === restaurantId);
                set({ selectedRestaurant: restaurant || null });
            },

            getRestaurantById: (restaurantId) => {
                return get().restaurants.find((r) => r.id === restaurantId);
            },

            getMenuItemsByRestaurant: async (restaurantId) => {
                // Check if it's a valid UUID to avoid Supabase 400 errors
                const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(restaurantId);
                
                if (isUUID) {
                    const { data, error } = await supabase
                        .from('menu_items')
                        .select('*')
                        .eq('restaurant_id', restaurantId);

                    if (!error && data && data.length > 0) {
                        return (data as DBMenuItem[]).map((m) => ({
                            id: m.id,
                            name: m.name,
                            price: parseFloat(m.price),
                            category: m.category,
                            image: m.image,
                            restaurant_id: m.restaurant_id
                        }));
                    }
                }

                // Fallback to static data for demo/static IDs
                return [
                    { id: 1, name: 'Andhra Special Veg Thali', price: 280, category: 'main', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop' },
                    { id: 2, name: 'Rayalaseema Chicken Biryani', price: 350, category: 'main', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=400&fit=crop' },
                    { id: 201, name: 'Masala Majjiga (Spiced Buttermilk)', price: 60, category: 'drinks', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop' },
                    { id: 202, name: 'Fresh Lime Soda', price: 80, category: 'drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop' },
                    { id: 4, name: 'Pootharekulu (Paper Sweet)', price: 150, category: 'desserts', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop' },
                    { id: 204, name: 'Badam Milk (Hot)', price: 120, category: 'drinks', image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=400&h=400&fit=crop' },
                ] as MenuItem[];
            },
        }),
        {
            name: 'bhojanālaya-restaurant-storage-v3',
            partialize: (state) => ({ selectedRestaurant: state.selectedRestaurant, restaurants: state.restaurants }),
        }
    )
);
