import React, { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, ShoppingCart, Trash2, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useNavigate } from "react-router-dom";
import { useRestaurantStore } from "@/store";
import { MenuItem } from "@/store/restaurantStore";
import { motion } from "framer-motion";

export function CartSheet() {
    const { isCartOpen, closeCart } = useUIStore();
    const { items, updateQuantity, removeItem, getTotal } = useCartStore();
    const navigate = useNavigate();
    const total = getTotal();
    const { getMenuItemsByRestaurant } = useRestaurantStore();

    const [recommendations, setRecommendations] = useState<MenuItem[]>([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            const restaurantId = items[0]?.restaurantId || 'southern-spice';
            const allMenuItems = await getMenuItemsByRestaurant(restaurantId);
            
            if (Array.isArray(allMenuItems)) {
                const cartItemIds = new Set(items.map(i => i.id));
                const filtered = allMenuItems
                    .filter(item => (item.category === 'drinks' || item.category === 'desserts') && !cartItemIds.has(item.id))
                    .slice(0, 4);
                setRecommendations(filtered);
            }
        };

        fetchRecommendations();
    }, [items, getMenuItemsByRestaurant]);

    const { addItem } = useCartStore();

    const handleCheckout = () => {
        closeCart();
        navigate("/checkout");
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={closeCart}>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-background border-l border-primary/10">
                <SheetHeader className="p-6 pb-2 border-b bg-white/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="font-heading text-2xl font-bold flex items-center gap-2">
                            <ShoppingCart className="h-6 w-6 text-primary" />
                            Your Order
                        </SheetTitle>
                        <div className="bg-primary/10 px-3 py-1 rounded-full">
                            <span className="text-primary font-bold text-sm">{items.length} items</span>
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-hidden">
                    {items.length === 0 ? (
                        <EmptyState
                            title="Your cart is empty"
                            description="Browse our menu and pick something delicious!"
                            icon={ShoppingCart}
                            action={{
                                label: "Browse Menu Now",
                                onClick: () => {
                                    closeCart();
                                    navigate("/menu");
                                },
                            }}
                            className="h-full border-none shadow-none"
                        />
                    ) : (
                        <ScrollArea className="h-full">
                            <div className="p-6 space-y-8">
                                {/* AI Wait Time Prediction */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-primary/5 rounded-[1.5rem] p-4 border border-primary/10 flex items-center gap-4"
                                >
                                    <div className="h-12 w-12 rounded-2xl bg-white shadow-soft flex items-center justify-center text-2xl">
                                        🤖
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Smart Prediction</p>
                                        <p className="text-sm text-foreground font-bold leading-none mt-1">
                                            Ready in about <span className="text-primary">{8 + (items.length * 2)} mins</span>
                                        </p>
                                    </div>
                                </motion.div>

                                <div className="space-y-6">
                                    <h3 className="font-heading text-lg font-bold">Selected Dishes</h3>
                                    {items.map((item, idx) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="flex gap-4 group"
                                        >
                                            <div className="relative h-24 w-24 flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full rounded-2xl object-cover shadow-soft group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                            <div className="flex-1 py-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-heading font-bold text-base leading-tight">{item.name}</h4>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <p className="text-primary font-bold text-sm mb-3">₹{(item.price * item.quantity).toFixed(2)}</p>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center bg-muted/50 rounded-xl p-1 border border-border/50">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-soft transition-all"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-bold">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:shadow-glow transition-all"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* AI Food Recommendation */}
                                {(() => {
                                    const recommendFood = (cartItems: typeof items) => {
                                        const cartNames = cartItems.map(i => i.name.toLowerCase());
                                        if (cartNames.some(n => n.includes("burger"))) return "Fries";
                                        if (cartNames.some(n => n.includes("pizza"))) return "Garlic Bread";
                                        if (cartNames.some(n => n.includes("biryani"))) return "Coolers";
                                        return "Desserts";
                                    };
                                    const suggestion = recommendFood(items);

                                    return (
                                        <div className="pt-8 border-t border-dashed">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="h-4 w-4 text-secondary" />
                                                    <h4 className="font-heading font-bold text-sm tracking-wide uppercase">Often Paired With</h4>
                                                </div>
                                                <span className="text-[10px] font-bold bg-secondary/10 text-secondary px-2 py-0.5 rounded-full uppercase tracking-tighter">AI Pick: {suggestion}</span>
                                            </div>

                                            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                                                {recommendations.map((item) => (
                                                    <div key={item.id} className="flex-shrink-0 w-36 p-3 rounded-[1.5rem] bg-card border border-border/40 shadow-soft group hover:border-primary/30 transition-all">
                                                        <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                            <button
                                                                onClick={() => addItem(item)}
                                                                className="absolute bottom-1 right-1 w-8 h-8 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                        <h5 className="text-xs font-bold truncate mb-1">{item.name}</h5>
                                                        <p className="text-[11px] text-primary font-bold">₹{item.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 bg-white/80 backdrop-blur-md border-t border-primary/10 shadow-[0_-8px_32px_rgba(0,0,0,0.05)]">
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center justify-between text-muted-foreground text-sm font-medium px-1">
                                <span>Order Subtotal</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-xl font-bold px-1">
                                <span>Total <span className="text-[10px] font-normal text-muted-foreground uppercase tracking-widest ml-1">Inc. Fees</span></span>
                                <span className="text-primary bg-primary/5 px-2 rounded-lg">₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                        <Button
                            size="lg"
                            className="w-full h-14 rounded-2xl text-lg font-bold shadow-glow hover:shadow-glow-lg transition-all active:scale-[0.98]"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
