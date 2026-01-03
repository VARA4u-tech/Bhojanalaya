// Re-export all stores for easy importing
export { useCartStore } from './cartStore';
export type { CartItem } from './cartStore';

export { useUserStore } from './userStore';
export type { User, UserPreferences } from './userStore';

export { useOrderStore } from './orderStore';
export type { Order, OrderItem, OrderStatus } from './orderStore';

export { useRestaurantStore } from './restaurantStore';
export type { Restaurant } from './restaurantStore';

export { useBookingStore } from './bookingStore';
export type { Booking, BookingStatus } from './bookingStore';
