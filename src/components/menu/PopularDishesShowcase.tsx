import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

type PopularDish = {
    name: string;
    category: string;
    description: string;
    price: number;
    image: string;
};

const popularDishes: PopularDish[] = [
    {
        name: "Rayalaseema Mutton Biryani",
        category: "Main Course",
        description: "Authentic Rayalaseema style mutton biryani with aromatic spices, tender meat, and fragrant basmati rice. A true legacy dish passed down through generations.",
        price: 380,
        image: "/images/popular/mutton-biryani.png",
    },
    {
        name: "Special Babai Idli",
        category: "Breakfast",
        description: "Soft, fluffy idlis served with our signature chutneys and sambar. Made fresh every morning with the finest ingredients.",
        price: 80,
        image: "/images/popular/babai-idli.png",
    },
    {
        name: "Ulavacharu Biryani",
        category: "Main Course",
        description: "A unique fusion of horsegram curry and aromatic biryani. This Andhra specialty is a must-try for biryani enthusiasts.",
        price: 320,
        image: "/images/popular/ulavacharu-biryani.png",
    },
    {
        name: "Pootharekulu",
        category: "Desserts",
        description: "Paper-thin sweet delicacy from Atreyapuram. Crispy rice starch sheets layered with ghee and sugar - a melt-in-mouth experience.",
        price: 150,
        image: "/images/menu/pootharekulu.png",
    },
];

export const PopularDishesShowcase = ({
    autoplay = true,
    className,
}: {
    autoplay?: boolean;
    className?: string;
}) => {
    const [active, setActive] = useState(0);

    const handleNext = () => {
        setActive((prev) => (prev + 1) % popularDishes.length);
    };

    const handlePrev = () => {
        setActive((prev) => (prev - 1 + popularDishes.length) % popularDishes.length);
    };

    const isActive = (index: number) => {
        return index === active;
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (autoplay) {
            interval = setInterval(() => {
                handleNext();
            }, 5000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoplay]);

    const randomRotateY = () => {
        return Math.floor(Math.random() * 21) - 10;
    };

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
                        Our <span className="text-secondary">Popular Dishes</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Discover the flavors that keep our guests coming back for more
                    </p>
                </motion.div>

                <div className={cn("max-w-sm md:max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-12 border border-primary/10 rounded-[3rem] bg-background/50 backdrop-blur-sm shadow-xl", className)}>
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                        <div>
                            <div className="relative h-80 w-full">
                                <AnimatePresence>
                                    {popularDishes.map((dish, index) => (
                                        <motion.div
                                            key={dish.image}
                                            initial={{
                                                opacity: 0,
                                                scale: 0.9,
                                                z: -100,
                                                rotate: randomRotateY(),
                                            }}
                                            animate={{
                                                opacity: isActive(index) ? 1 : 0.7,
                                                scale: isActive(index) ? 1 : 0.95,
                                                z: isActive(index) ? 0 : -100,
                                                rotate: isActive(index) ? 0 : randomRotateY(),
                                                zIndex: isActive(index)
                                                    ? 999
                                                    : popularDishes.length + 2 - index,
                                                y: isActive(index) ? [0, -80, 0] : 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.9,
                                                z: 100,
                                                rotate: randomRotateY(),
                                            }}
                                            transition={{
                                                duration: 0.4,
                                                ease: "easeInOut",
                                            }}
                                            className="absolute inset-0 origin-bottom"
                                        >
                                            <img
                                                src={dish.image}
                                                alt={dish.name}
                                                draggable={false}
                                                className="h-full w-full rounded-3xl object-cover object-center shadow-2xl"
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                        <div className="flex justify-between flex-col py-4">
                            <motion.div
                                key={active}
                                initial={{
                                    y: 20,
                                    opacity: 0,
                                }}
                                animate={{
                                    y: 0,
                                    opacity: 1,
                                }}
                                exit={{
                                    y: -20,
                                    opacity: 0,
                                }}
                                transition={{
                                    duration: 0.2,
                                    ease: "easeInOut",
                                }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Flame className="h-5 w-5 text-secondary" />
                                    <span className="text-sm font-medium text-secondary">Popular Choice</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-foreground font-heading">
                                    {popularDishes[active].name}
                                </h3>
                                <p className="text-base text-primary font-medium mb-4">
                                    {popularDishes[active].category}
                                </p>
                                <motion.p className="text-base md:text-lg text-muted-foreground mt-4 leading-relaxed">
                                    {popularDishes[active].description.split(" ").map((word, index) => (
                                        <motion.span
                                            key={index}
                                            initial={{
                                                filter: "blur(10px)",
                                                opacity: 0,
                                                y: 5,
                                            }}
                                            animate={{
                                                filter: "blur(0px)",
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            transition={{
                                                duration: 0.2,
                                                ease: "easeInOut",
                                                delay: 0.02 * index,
                                            }}
                                            className="inline-block"
                                        >
                                            {word}&nbsp;
                                        </motion.span>
                                    ))}
                                </motion.p>
                                <div className="mt-6">
                                    <span className="text-2xl font-bold text-secondary">₹{popularDishes[active].price}</span>
                                </div>
                            </motion.div>
                            <div className="flex gap-4 pt-8 md:pt-0">
                                <button
                                    onClick={handlePrev}
                                    className="h-12 w-12 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center group/button transition-colors"
                                    aria-label="Previous dish"
                                >
                                    <IconArrowLeft className="h-6 w-6 text-secondary group-hover/button:rotate-12 transition-transform duration-300" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="h-12 w-12 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center group/button transition-colors"
                                    aria-label="Next dish"
                                >
                                    <IconArrowRight className="h-6 w-6 text-secondary group-hover/button:-rotate-12 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
