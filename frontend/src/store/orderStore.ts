import { create } from 'zustand';

export type OrderStatus = 'waiting' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';

export interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    restaurantId?: string;
    restaurantName?: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    estimatedTime?: number; // in minutes
    tableNumber?: string;
    notes?: string;
    refundAmount?: number; // 50% refund on cancellation
}

interface OrderState {
    orders: Order[];
    activeOrder: Order | null;
    createOrder: (items: OrderItem[], tableNumber?: string, notes?: string, restaurantId?: string, restaurantName?: string) => Order;
    cancelOrder: (orderId: string) => boolean;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    setActiveOrder: (orderId: string | null) => void;
    getOrderById: (orderId: string) => Order | undefined;
    getOrderHistory: () => Order[];
    clearOrders: () => void;
}

// Mock order generation
const generateOrderNumber = () => {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    activeOrder: null,

    createOrder: (items, tableNumber, notes, restaurantId, restaurantName) => {
        const newOrder: Order = {
            id: crypto.randomUUID(),
            orderNumber: generateOrderNumber(),
            restaurantId,
            restaurantName,
            items,
            total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            status: 'waiting',
            createdAt: new Date(),
            updatedAt: new Date(),
            estimatedTime: 20 + Math.floor(Math.random() * 20), // 20-40 minutes
            tableNumber,
            notes,
        };

        set((state) => ({
            orders: [newOrder, ...state.orders],
            activeOrder: newOrder,
        }));

        return newOrder;
    },

    cancelOrder: (orderId) => {
        const order = get().getOrderById(orderId);
        if (!order) return false;

        // Only allow cancellation for orders in 'waiting' or 'confirmed' status
        if (order.status !== 'waiting' && order.status !== 'confirmed') {
            return false;
        }

        // Calculate 50% refund
        const refundAmount = order.total * 0.5;

        set((state) => ({
            orders: state.orders.map((o) =>
                o.id === orderId
                    ? {
                        ...o,
                        status: 'cancelled' as OrderStatus,
                        updatedAt: new Date(),
                        refundAmount
                    }
                    : o
            ),
            activeOrder:
                state.activeOrder?.id === orderId
                    ? {
                        ...state.activeOrder,
                        status: 'cancelled',
                        updatedAt: new Date(),
                        refundAmount
                    }
                    : state.activeOrder,
        }));

        return true;
    },

    updateOrderStatus: (orderId, status) => {
        set((state) => ({
            orders: state.orders.map((order) =>
                order.id === orderId
                    ? { ...order, status, updatedAt: new Date() }
                    : order
            ),
            activeOrder:
                state.activeOrder?.id === orderId
                    ? { ...state.activeOrder, status, updatedAt: new Date() }
                    : state.activeOrder,
        }));
    },

    setActiveOrder: (orderId) => {
        const order = orderId ? get().getOrderById(orderId) : null;
        set({ activeOrder: order || null });
    },

    getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
    },

    getOrderHistory: () => {
        return get().orders.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },

    clearOrders: () => {
        set({ orders: [], activeOrder: null });
    },
}));
