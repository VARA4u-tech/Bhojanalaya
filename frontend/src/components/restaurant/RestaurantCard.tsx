import { Restaurant } from "@/store";
import { Star, MapPin, Clock, Phone, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RestaurantCardProps {
  restaurant: Restaurant;
  isSelected?: boolean;
  onClick?: () => void;
}

export function RestaurantCard({
  restaurant,
  isSelected,
  onClick,
}: RestaurantCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group organic-card overflow-hidden hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full",
        isSelected &&
          "ring-4 ring-primary ring-offset-4 ring-offset-background",
      )}
    >
      {/* Restaurant Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          style={{ imageRendering: "auto" }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80"; // Fallback
          }}
        />
        {isSelected && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-lg">
            <Leaf className="w-3.5 h-3.5" />
            Selected
          </div>
        )}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-md text-primary text-xs font-bold uppercase border border-primary/20 shadow-sm">
          {restaurant.cuisine}
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-heading text-xl text-primary font-semibold mb-1">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{restaurant.rating}</span>
              </div>
              <span className="text-muted-foreground">
                ({restaurant.reviewCount} reviews)
              </span>
            </div>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {restaurant.priceRange}
          </span>
        </div>

        <p className="text-sm font-serif italic text-muted-foreground mb-6 line-clamp-2">
          {restaurant.description}
        </p>

        <div className="mt-auto space-y-2.5 text-xs text-muted-foreground/80 font-medium">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{restaurant.operatingHours}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{restaurant.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <span>{restaurant.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
