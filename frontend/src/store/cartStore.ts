import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    category?: string;
    restaurantId?: string;
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    addBulkItems: (items: CartItem[]) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item, quantity = 1) => {
                set((state) => {
                    const existingItem = state.items.find((i) => i.id === item.id);

                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id
                                    ? { ...i, quantity: i.quantity + quantity }
                                    : i
                            ),
                        };
                    }

                    return {
                        items: [...state.items, { ...item, quantity }],
                    };
                });
            },

            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                }));
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                }));
            },

            addBulkItems: (newItems) => {
                set((state) => {
                    const updatedItems = [...state.items];
                    newItems.forEach((newItem) => {
                        const existingItemIndex = updatedItems.findIndex((i) => i.id === newItem.id);
                        if (existingItemIndex !== -1) {
                            updatedItems[existingItemIndex] = {
                                ...updatedItems[existingItemIndex],
                                quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
                            };
                        } else {
                            updatedItems.push(newItem);
                        }
                    });
                    return { items: updatedItems };
                });
            },

            clearCart: () => {
                set({ items: [] });
            },

            getTotal: () => {
                return get().items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'bhojanālaya-cart-storage',
        }
    )
);
