import { useRestaurantStore } from "@/store";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { motion } from "framer-motion";

export const RestaurantShowcase = () => {
    const { restaurants } = useRestaurantStore();

    const restaurantTestimonials = restaurants.slice(0, 5).map((r) => ({
        quote: r.description,
        name: r.name,
        designation: r.cuisine,
        src: r.image,
    }));

    return (
        <div className="py-24 bg-gradient-to-b from-background to-primary/5">
            <div className="container px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-h2 font-heading font-bold mb-4">
                        Vijayawada's <span className="text-secondary">Culinary Icons</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Experience the heartbeat of the city through its most legendary dining destinations.
                    </p>
                </motion.div>

                <AnimatedTestimonials
                    testimonials={restaurantTestimonials}
                    autoplay={true}
                    className="border border-primary/10 rounded-[3rem] bg-background/50 backdrop-blur-sm shadow-xl"
                />
            </div>
        </div>
    );
};
