import { MenuItemCard } from "@/components/ui/menu-item-card";
import { CustomerLayout } from "@/components/layout/CustomerLayout";

const menuItems = [
    {
        imageUrl: "https://images.unsplash.com/photo-1544145945-f904253db0ad?w=1260&h=750&q=80",
        isVegetarian: true,
        name: "Strawberry Lemonade",
        price: 139,
        originalPrice: 279,
        quantity: "450 ml",
        prepTimeInMinutes: 5,
    },
    {
        imageUrl: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=1260&h=750&q=80",
        isVegetarian: true,
        name: "Vietnamese Cold Coffee",
        price: 189,
        originalPrice: 529,
        quantity: "450 ml",
        prepTimeInMinutes: 5,
    },
    {
        imageUrl: "https://images.unsplash.com/photo-1585933334449-3bc55627265a?w=1260&h=750&q=80",
        isVegetarian: true,
        name: "Chole & Chapati",
        price: 149,
        originalPrice: 419,
        quantity: "Serves 1",
        prepTimeInMinutes: 20,
    },
    {
        imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1260&h=750&q=80",
        isVegetarian: true,
        name: "Special Bhelpuri",
        price: 119,
        originalPrice: 229,
        quantity: "1 Portion",
        prepTimeInMinutes: 10,
    },
];

export default function MenuItemCardDemo() {
    const handleAddItem = (itemName: string) => {
        console.log(`Added ${itemName} to cart!`);
        alert(`Added ${itemName} to cart!`);
    };

    return (
        <div className="container py-20 bg-background text-center">
            <h1 className="text-4xl font-heading font-bold mb-4">Premium Menu Cards</h1>
            <p className="text-muted-foreground mb-12">Previewing the brand new MenuItemCard component</p>

            <div className="grid w-full max-w-6xl mx-auto grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {menuItems.map((item, index) => (
                    <MenuItemCard
                        key={index}
                        imageUrl={item.imageUrl}
                        isVegetarian={item.isVegetarian}
                        name={item.name}
                        price={item.price}
                        originalPrice={item.originalPrice}
                        quantity={item.quantity}
                        prepTimeInMinutes={item.prepTimeInMinutes}
                        onAdd={() => handleAddItem(item.name)}
                    />
                ))}
            </div>
        </div>
    );
}
