import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
    id: string;
    restaurantId: string;
    restaurantName: string;
    date: Date;
    time: string;
    guests: number;
    tableNumber?: string;
    name: string;
    email: string;
    phone: string;
    specialRequests?: string;
    status: BookingStatus;
    createdAt: Date;
}

interface BookingState {
    bookings: Booking[];
    addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Booking;
    cancelBooking: (bookingId: string) => void;
    getUpcomingBookings: () => Booking[];
    getBookingById: (bookingId: string) => Booking | undefined;
}

export const useBookingStore = create<BookingState>()(
    persist(
        (set, get) => ({
            bookings: [],

            addBooking: (bookingData) => {
                const newBooking: Booking = {
                    ...bookingData,
                    id: crypto.randomUUID(),
                    createdAt: new Date(),
                    status: 'pending',
                };

                set((state) => ({
                    bookings: [...state.bookings, newBooking],
                }));

                return newBooking;
            },

            cancelBooking: (bookingId) => {
                set((state) => ({
                    bookings: state.bookings.map((booking) =>
                        booking.id === bookingId
                            ? { ...booking, status: 'cancelled' as BookingStatus }
                            : booking
                    ),
                }));
            },

            getUpcomingBookings: () => {
                const now = new Date();
                return get()
                    .bookings.filter(
                        (booking) =>
                            booking.status !== 'cancelled' &&
                            booking.status !== 'completed' &&
                            new Date(booking.date) >= now
                    )
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            },

            getBookingById: (bookingId) => {
                return get().bookings.find((booking) => booking.id === bookingId);
            },
        }),
        {
            name: 'bhojanālaya-bookings-storage',
        }
    )
);
