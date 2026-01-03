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
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useNavigate } from "react-router-dom";
import { useRestaurantStore } from "@/store";
import { Sparkles } from "lucide-react";

export function CartSheet() {
    const { isCartOpen, closeCart } = useUIStore();
    const { items, updateQuantity, removeItem, getTotal } = useCartStore();
    const navigate = useNavigate();
    const total = getTotal();
    const { getMenuItemsByRestaurant } = useRestaurantStore();

    // Get recommendations (drinks/desserts not in cart)
    const allMenuItems = getMenuItemsByRestaurant(items[0]?.restaurantId || 'southern-spice');
    const cartItemIds = new Set(items.map(i => i.id));
    const recommendations = allMenuItems
        .filter(item => (item.category === 'drinks' || item.category === 'desserts') && !cartItemIds.has(item.id))
        .slice(0, 4);

    const { addItem } = useCartStore();

    const handleCheckout = () => {
        closeCart();
        // Navigate to checkout or just show success for now (since checkout wasn't in requirements yet)
        // For now, let's just go to menu or maybe we should have a checkout page? 
        // Phase 1 didn't specify checkout. We'll just close it or log it.
        console.log("Proceeding to checkout");
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={closeCart}>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                    <SheetTitle className="font-heading text-2xl">Your Order</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-hidden mt-8">
                    {items.length === 0 ? (
                        <EmptyState
                            title="Your cart is empty"
                            description="Looks like you haven't added anything yet."
                            icon={ShoppingCart}
                            action={{
                                label: "Browse Menu",
                                onClick: () => {
                                    closeCart();
                                    navigate("/menu");
                                },
                            }}
                            className="h-full border-none shadow-none"
                        />
                    ) : (
                        <ScrollArea className="h-full pr-4">
                            <div className="space-y-6">
                                {/* AI Wait Time Prediction */}
                                <div className="bg-primary/5 rounded-xl p-3 border border-primary/10 flex items-center justify-center gap-2">
                                    <span className="text-xl">🤖</span>
                                    <p className="text-sm text-primary font-medium">
                                        Estimated Ready Time: <span className="font-bold">{8 + (items.length * 2)} mins</span>
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4 animate-slide-up">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 rounded-xl object-cover"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-heading font-semibold mb-1">{item.name}</h4>
                                                <p className="text-sm text-primary font-bold mb-2">
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="ml-auto w-8 h-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* AI Food Recommendation */}
                                {(() => {
                                    // AI Logic as requested
                                    const recommendFood = (cartItems: typeof items) => {
                                        const cartNames = cartItems.map(i => i.name.toLowerCase());
                                        if (cartNames.some(n => n.includes("burger"))) return "Fries";
                                        if (cartNames.some(n => n.includes("pizza"))) return "Garlic Bread";
                                        if (cartNames.some(n => n.includes("biryani"))) return "Thums Up";
                                        return "Soft Drink";
                                    };
                                    const suggestion = recommendFood(items);

                                    return (
                                        <div className="pt-6 border-t animate-slide-up">
                                            <div className="flex items-center gap-2 mb-4 bg-secondary/10 p-3 rounded-xl border border-secondary/20">
                                                <span className="text-xl">🤖</span>
                                                <p className="text-sm font-medium">
                                                    Recommended Add-on: <span className="text-secondary font-bold">{suggestion}</span>
                                                </p>
                                            </div>

                                            {/* Show actual items related to suggestion if available, else default list */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles className="h-4 w-4 text-primary" />
                                                <h4 className="font-heading font-semibold text-sm">Suggested Items</h4>
                                            </div>
                                            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                                                {recommendations.map((item) => (
                                                    <div key={item.id} className="flex-shrink-0 w-32 group">
                                                        <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                            <button
                                                                onClick={() => addItem(item)}
                                                                className="absolute bottom-1 right-1 w-7 h-7 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                        <div className="text-xs font-semibold truncate">{item.name}</div>
                                                        <div className="text-[10px] text-primary font-bold">₹{item.price}</div>
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
                    <SheetFooter className="mt-8">
                        <div className="w-full space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                            <Button size="lg" className="w-full" onClick={handleCheckout}>
                                Checkout
                            </Button>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
