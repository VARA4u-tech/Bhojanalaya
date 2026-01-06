"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

export interface Gallery4Item {
    id: string;
    title: string;
    description: string;
    href?: string;
    image: string;
}

export interface Gallery4Props {
    title?: string;
    description?: string;
    items: Gallery4Item[];
    onItemClick?: (id: string) => void;
}

const Gallery4 = ({
    title = "Case Studies",
    description = "Discover how leading companies and developers are leveraging modern web technologies to build exceptional digital experiences.",
    items = [],
    onItemClick,
}: Gallery4Props) => {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const plugin = useRef(
        Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })
    );

    useEffect(() => {
        if (!carouselApi) {
            return;
        }
        const updateSelection = () => {
            setCanScrollPrev(carouselApi.canScrollPrev());
            setCanScrollNext(carouselApi.canScrollNext());
            setCurrentSlide(carouselApi.selectedScrollSnap());
        };
        updateSelection();
        carouselApi.on("select", updateSelection);
        return () => {
            carouselApi.off("select", updateSelection);
        };
    }, [carouselApi]);

    return (
        <section className="py-12 lg:py-24 overflow-hidden">
            <div className="container mx-auto">
                <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-3xl font-heading font-bold md:text-4xl lg:text-5xl">
                            {title}
                        </h2>
                        <p className="max-w-lg text-muted-foreground">{description}</p>
                    </div>
                    <div className="hidden shrink-0 gap-2 md:flex">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                carouselApi?.scrollPrev();
                            }}
                            disabled={!canScrollPrev}
                            className="rounded-full border-primary/20 text-primary hover:bg-primary/5 disabled:opacity-50"
                            aria-label="Previous slide"
                        >
                            <ArrowLeft className="size-5" />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                carouselApi?.scrollNext();
                            }}
                            disabled={!canScrollNext}
                            className="rounded-full border-primary/20 text-primary hover:bg-primary/5 disabled:opacity-50"
                            aria-label="Next slide"
                        >
                            <ArrowRight className="size-5" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <Carousel
                    setApi={setCarouselApi}
                    plugins={[plugin.current]}
                    opts={{
                        align: "start",
                        loop: true,
                        skipSnaps: false,
                        breakpoints: {
                            "(max-width: 768px)": {
                                dragFree: true,
                            },
                        },
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4 2xl:ml-[max(8rem,calc(50vw-700px))]">
                        {items.map((item) => (
                            <CarouselItem
                                key={item.id}
                                className="max-w-[280px] sm:max-w-[320px] pl-4 lg:max-w-[400px]"
                            >
                                <motion.div
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onItemClick?.(item.id)}
                                    className="group cursor-pointer block h-full"
                                >
                                    <div className="group relative h-full min-h-[24rem] sm:min-h-[30rem] max-w-full overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] aspect-[3/4] md:aspect-[4/5] shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            fetchPriority="high"
                                            loading="eager"
                                            className="absolute h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"; // High-res fallback
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                                        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 sm:p-8 text-primary-foreground md:p-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="mb-2 text-xl font-heading font-bold sm:text-2xl md:mb-4">
                                                {item.title}
                                            </div>
                                            <div className="mb-6 line-clamp-2 text-xs sm:text-sm text-primary-foreground/80 md:mb-12">
                                                {item.description}
                                            </div>
                                            <div className="flex items-center text-[10px] sm:text-sm font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-3 rounded-full hover:bg-white/30 transition-colors">
                                                Explore Menu{" "}
                                                <ArrowRight className="ml-1.5 sm:ml-2 size-3 sm:size-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                {/* Progress Dots */}
                <div className="mt-12 flex justify-center gap-3">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            className={`h-2 transition-all duration-300 rounded-full ${currentSlide === index ? "w-8 bg-primary" : "w-2 bg-primary/20"
                                }`}
                            onClick={() => carouselApi?.scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export { Gallery4 };
