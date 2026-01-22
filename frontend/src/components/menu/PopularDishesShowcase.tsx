
import { MenuItemCard } from "@/components/ui/menu-item-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const POPULAR_DISHES = [
    {
        id: 1,
        name: "Ulavacharu Biryani",
        description: "Authentic spicy horse gram soup infused biryani",
        imageUrl: "/images/popular/ulavacharu-biryani.png",
        price: 420,
        originalPrice: 480,
        quantity: "Serves 1-2",
        prepTimeInMinutes: 30,
        isVegetarian: false,
        rating: 4.8,
        reviews: 120,
    },
    {
        id: 2,
        name: "Babai Hotel Idli",
        description: "Soft, fluffy idlis served with ghee and karam podi",
        imageUrl: "/images/popular/babai-idli.png",
        price: 80,
        originalPrice: 100,
        quantity: "3 Pieces",
        prepTimeInMinutes: 10,
        isVegetarian: true,
        rating: 4.9,
        reviews: 250,
    },
    {
        id: 3,
        name: "Mutton Dum Biryani",
        description: "Tender mutton pieces marinated in exotic spices",
        imageUrl: "/images/popular/mutton-biryani.png",
        price: 450,
        originalPrice: 520,
        quantity: "Serves 1-2",
        prepTimeInMinutes: 35,
        isVegetarian: false,
        rating: 4.7,
        reviews: 180,
    },
    {
        id: 4,
        name: "Pootharekulu",
        description: "Traditional paper sweet with ghee and jaggery",
        imageUrl: "/images/menu/pootharekulu.png",
        price: 120,
        originalPrice: 150,
        quantity: "2 Pieces",
        prepTimeInMinutes: 5,
        isVegetarian: true,
        rating: 4.9,
        reviews: 300,
    },
];

export function PopularDishesShowcase() {
    const handleAddToCart = (dishName: string) => {
        // In a real app, this would dispatch to cart store
        console.log(`Added ${dishName} to cart`);
    };

    return (
        <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
            <div className="container px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                            <Sparkles className="w-3 h-3" />
                            <span>Customer Favorites</span>
                        </div>
                        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            Popular Dishes
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl">
                            Discover the most loved dishes from our kitchen, curated just for you based on customer reviews and popularity.
                        </p>
                    </div>

                    <Link to="/menu">
                        <Button variant="outline" size="lg" className="group">
                            View Full Menu
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {POPULAR_DISHES.map((dish) => (
                        <MenuItemCard
                            key={dish.id}
                            imageUrl={dish.imageUrl}
                            isVegetarian={dish.isVegetarian}
                            name={dish.name}
                            price={dish.price}
                            originalPrice={dish.originalPrice}
                            quantity={dish.quantity}
                            prepTimeInMinutes={dish.prepTimeInMinutes}
                            onAdd={() => handleAddToCart(dish.name)}
                            className="h-full"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
