import { useRestaurantStore } from "@/store";
import { RestaurantCard } from "./RestaurantCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface RestaurantSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RestaurantSelector({ open, onOpenChange }: RestaurantSelectorProps) {
    const { restaurants, selectedRestaurant, selectRestaurant } = useRestaurantStore();

    const handleSelectRestaurant = (restaurantId: string) => {
        selectRestaurant(restaurantId);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl">Choose Your Restaurant</DialogTitle>
                    <DialogDescription>
                        Select from our curated collection of restaurants
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-1">
                    <div className="grid md:grid-cols-2 gap-4 pb-4">
                        {restaurants.map((restaurant) => (
                            <RestaurantCard
                                key={restaurant.id}
                                restaurant={restaurant}
                                isSelected={selectedRestaurant?.id === restaurant.id}
                                onClick={() => handleSelectRestaurant(restaurant.id)}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        <X className="h-4 w-4" />
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
