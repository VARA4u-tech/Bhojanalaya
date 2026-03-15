import { create } from 'zustand';
import { supabase } from '../lib/supabase';

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
    estimatedTime?: number;
    tableNumber?: string;
    notes?: string;
    userId?: string;
}

interface OrderState {
    orders: Order[];
    activeOrder: Order | null;
    isLoading: boolean;
    fetchOrders: () => Promise<void>;
    subscribeToOrders: () => () => void;
    createOrder: (items: OrderItem[], tableNumber?: string, notes?: string, restaurantId?: string, restaurantName?: string, status?: OrderStatus) => Promise<Order | null>;
    updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
    setActiveOrder: (orderId: string | null) => void;
    getOrderById: (orderId: string) => Order | undefined;
}

const generateOrderNumber = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

interface DBOrder {
    id: string;
    order_number: string;
    restaurant_id: string;
    items: OrderItem[];
    total: string;
    status: string;
    created_at: string;
    updated_at: string;
    table_number: string;
    notes: string;
    user_id: string;
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    activeOrder: null,
    isLoading: false,

    fetchOrders: async () => {
        set({ isLoading: true });
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            const mappedOrders: Order[] = (data as DBOrder[]).map((o) => ({
                id: o.id,
                orderNumber: o.order_number || o.id.substring(0, 15),
                restaurantId: o.restaurant_id,
                items: o.items as OrderItem[],
                total: parseFloat(o.total),
                status: o.status as OrderStatus,
                createdAt: new Date(o.created_at),
                updatedAt: new Date(o.updated_at),
                tableNumber: o.table_number,
                notes: o.notes,
                userId: o.user_id
            }));
            set({ orders: mappedOrders, isLoading: false });
        } else {
            console.error('Error fetching orders:', error);
            set({ isLoading: false });
        }
    },

    subscribeToOrders: () => {
        const subscription = supabase
            .channel('orders-realtime')
            .on('postgres_changes', { event: '*', table: 'orders', schema: 'public' }, () => {
                get().fetchOrders();
            })
            .subscribe();
        
        return () => {
            supabase.removeChannel(subscription);
        };
    },

    createOrder: async (items, tableNumber, notes, restaurantId, restaurantName, status = 'waiting') => {
        const { data: { user } } = await supabase.auth.getUser();
        
        const orderPayload = {
            user_id: user?.id,
            restaurant_id: restaurantId,
            items: items,
            total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            status: status,
            table_number: tableNumber,
            notes: notes,
            order_number: generateOrderNumber()
        };

        const { data, error } = await supabase
            .from('orders')
            .insert([orderPayload])
            .select()
            .single();

        if (error) {
            console.error('Error creating order:', error);
            return null;
        }

        const newOrder: Order = {
            id: data.id,
            orderNumber: data.order_number,
            restaurantId: data.restaurant_id,
            restaurantName,
            items: data.items,
            total: parseFloat(data.total),
            status: data.status as OrderStatus,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
            tableNumber: data.table_number,
            notes: data.notes,
        };

        set((state) => ({
            orders: [newOrder, ...state.orders],
            activeOrder: newOrder,
        }));

        return newOrder;
    },

    updateOrderStatus: async (orderId, status) => {
        const { error } = await supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', orderId);

        if (error) {
            console.error('Error updating status:', error);
            return;
        }

        set((state) => ({
            orders: state.orders.map((order) =>
                order.id === orderId ? { ...order, status, updatedAt: new Date() } : order
            ),
        }));
    },

    setActiveOrder: (orderId) => {
        const order = orderId ? get().orders.find(o => o.id === orderId) : null;
        set({ activeOrder: order || null });
    },

    getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId || order.orderNumber === orderId);
    },
}));
