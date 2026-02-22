import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useSpring } from "framer-motion";

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

/** Decorative SVG squiggle — echoes the poster's hand-drawn border feel */
const OrganicSwirls = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]">
    {/* Top-left leaf swirl */}
    <motion.svg
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="absolute -top-6 -left-6 w-40 h-40 text-primary/12"
      viewBox="0 0 200 200"
      fill="none"
    >
      <path
        d="M10 100 Q 50 10, 100 50 Q 150 90, 100 150 Q 50 190, 10 100Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M25 95 Q60 20, 105 55 Q145 88, 105 145"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
    </motion.svg>

    {/* Bottom-right leaf swirl */}
    <motion.svg
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      className="absolute -bottom-6 -right-6 w-48 h-48 text-secondary/15 rotate-180"
      viewBox="0 0 200 200"
      fill="none"
    >
      <path
        d="M10 100 Q 50 10, 100 50 Q 150 90, 100 150 Q 50 190, 10 100Z"
        fill="currentColor"
        opacity="0.12"
      />
    </motion.svg>

    {/* Soft glow blobs */}
    <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-primary/8 rounded-full blur-[80px]" />
    <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-secondary/8 rounded-full blur-[100px]" />
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
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || reducedMotion) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  const springConfig = { damping: 30, stiffness: 120 };
  const mouseX = useSpring(mousePosition.x, springConfig);
  const mouseY = useSpring(mousePosition.y, springConfig);

  // Split title on '|' for multi-line poster effect
  const titleParts = title.split("|");

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full min-h-[55vh] flex items-center justify-center overflow-hidden pt-20 pb-16 md:pt-16 md:pb-14 cursor-default",
        className,
      )}
    >
      {/* Outer organic border wrapper (matches poster's thick teal frame) */}
      <div className="absolute inset-4 sm:inset-6 lg:inset-8 rounded-[2.5rem] border-[3px] border-primary/20 pointer-events-none" />
      <div className="absolute inset-6 sm:inset-8 lg:inset-10 rounded-[2rem] border border-primary/10 pointer-events-none" />

      <OrganicSwirls />

      {/* Floating food illustrations — positioned like the poster's border illustrations */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <AnimatePresence>
          {images.map((image, index) => {
            const moveX = ((index % 3) + 1) * 12;
            const moveY = ((index % 2) + 1) * 8;

            return (
              <motion.div
                key={`${image.src}-${index}`}
                initial={{
                  opacity: 0,
                  scale: 0.7,
                  rotate: index % 2 === 0 ? -8 : 8,
                }}
                animate={
                  !reducedMotion
                    ? {
                        opacity: 1,
                        scale: 1,
                        rotate: index % 2 === 0 ? -3 : 3,
                        y: [0, -12, 0],
                        translateX: mouseX.get() * moveX,
                        translateY: mouseY.get() * moveY,
                      }
                    : { opacity: 1, scale: 1, rotate: 0 }
                }
                transition={
                  !reducedMotion
                    ? {
                        opacity: { duration: 0.8, delay: index * 0.18 },
                        scale: { duration: 0.8, delay: index * 0.18 },
                        rotate: { duration: 0.8, delay: index * 0.18 },
                        y: {
                          duration: 3.5 + (index % 3) * 0.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.4,
                        },
                      }
                    : {}
                }
                className={cn(
                  "absolute drop-shadow-xl",
                  image.className.replace("animate-float", ""),
                )}
              >
                <div className="relative group">
                  {/* Soft glow behind each food image */}
                  <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-90 opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-contain filter drop-shadow-[0_12px_32px_rgba(0,0,0,0.18)] transform transition-transform duration-500 hover:scale-110 hover:rotate-3"
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Central Poster-Style Content ── */}
      <div className="relative z-20 container mx-auto px-6 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          {/* Eyebrow line — "Come and Join Us At The" style */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif italic text-primary/70 text-sm sm:text-base md:text-lg tracking-wide mb-1 sm:mb-2"
          >
            Welcome to the finest
          </motion.p>

          {/* Main retro display title  */}
          <h1 className="font-heading text-foreground leading-[1.1] mb-4 sm:mb-5">
            {titleParts.map((part, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
                className={cn(
                  "block",
                  i === 0
                    ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground"
                    : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary",
                )}
              >
                {part.trim()}
              </motion.span>
            ))}
          </h1>

          {/* Decorative divider (like on the poster) */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-3 my-4 sm:my-5"
          >
            <div className="h-px w-16 sm:w-24 bg-primary/30 rounded-full" />
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <div className="h-px w-16 sm:w-24 bg-primary/30 rounded-full" />
          </motion.div>

          {/* Description — friendly market-stall copy style */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="font-sans text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground max-w-xl mx-auto mb-8 sm:mb-10"
          >
            {description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
