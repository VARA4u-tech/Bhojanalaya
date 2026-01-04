import { Restaurant } from "@/store";
import { Star, MapPin, Clock, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface RestaurantCardProps {
    restaurant: Restaurant;
    isSelected?: boolean;
    onClick?: () => void;
}

export function RestaurantCard({ restaurant, isSelected, onClick }: RestaurantCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 cursor-pointer",
                isSelected && "ring-2 ring-primary shadow-soft-lg"
            )}
        >
            {/* Restaurant Image */}
            <div className="relative aspect-[16/9] overflow-hidden">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80"; // Fallback
                    }}
                />
                {isSelected && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        Selected
                    </div>
                )}
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium">
                    {restaurant.cuisine}
                </div>
            </div>

            {/* Restaurant Info */}
            <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                        <h3 className="font-heading text-lg font-semibold mb-1">{restaurant.name}</h3>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{restaurant.rating}</span>
                            </div>
                            <span className="text-muted-foreground">({restaurant.reviewCount} reviews)</span>
                        </div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{restaurant.priceRange}</span>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{restaurant.description}</p>

                <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{restaurant.operatingHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{restaurant.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{restaurant.phone}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
