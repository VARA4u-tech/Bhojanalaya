import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';

interface FloatingImageProps {
    src: string;
    alt: string;
    className: string;
}

export interface FloatingFoodHeroProps {
    title: string;
    description: string;
    images: FloatingImageProps[];
    className?: string;
    children?: React.ReactNode;
}

const Swirls = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.svg
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-[-10%] left-[-10%] text-primary/10 w-[60%] h-[60%]"
            viewBox="0 0 600 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M515.266 181.33C377.943 51.564 128.537 136.256 50.8123 293.565C-26.9127 450.874 125.728 600 125.728 600"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </motion.svg>
        <motion.svg
            initial={{ opacity: 0, rotate: 10 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="absolute bottom-[-15%] right-[-10%] text-secondary/15 w-[70%] h-[70%]"
            viewBox="0 0 700 700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M26.8838 528.274C193.934 689.816 480.051 637.218 594.397 451.983C708.742 266.748 543.953 2.22235 543.953 2.22235"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </motion.svg>

        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]" />
    </div>
);

export function FloatingFoodHero({
    title,
    description,
    images,
    className,
    children,
}: FloatingFoodHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        setMousePosition({ x, y });
    };

    const springConfig = { damping: 25, stiffness: 150 };
    const mouseX = useSpring(mousePosition.x, springConfig);
    const mouseY = useSpring(mousePosition.y, springConfig);

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className={cn(
                'relative w-full min-h-[75vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden bg-background py-20 md:py-32 cursor-default',
                className
            )}
        >
            <Swirls />

            <div className="absolute inset-0 z-10 pointer-events-none">
                <AnimatePresence>
                    {images.map((image, index) => {
                        // Different intensities for each image for parallax depth
                        const moveX = (index % 3 + 1) * 30;
                        const moveY = (index % 2 + 1) * 20;

                        return (
                            <motion.div
                                key={`${image.src}-${index}`}
                                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    rotate: 0,
                                    y: [0, -15, 0],
                                    x: [0, 5, 0],
                                    translateX: mouseX.get() * moveX,
                                    translateY: mouseY.get() * moveY,
                                }}
                                transition={{
                                    opacity: { duration: 1, delay: index * 0.15 },
                                    scale: { duration: 1, delay: index * 0.15 },
                                    rotate: { duration: 1, delay: index * 0.15 },
                                    y: {
                                        duration: 4 + (index % 3),
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    },
                                    x: {
                                        duration: 5 + (index % 2),
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                }}
                                className={cn('absolute', image.className.replace('animate-float', ''))}
                            >
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] transform transition-transform duration-700 hover:scale-105"
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className="relative z-20 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-8xl leading-[1.1] mb-8 font-heading">
                        {title.split('. ').map((part, i) => (
                            <span key={i} className="block last:text-primary">
                                {part}{i === 0 ? '.' : ''}
                            </span>
                        ))}
                    </h1>
                    <p className="mt-8 text-lg md:text-2xl leading-relaxed text-muted-foreground max-w-2xl mx-auto mb-12">
                        {description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        {children}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
