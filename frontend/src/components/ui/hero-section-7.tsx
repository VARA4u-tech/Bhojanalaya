import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { cn } from "@/lib/utils";
import { motion, useSpring } from "framer-motion";

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

// ── Illustration components using emoji + colored blobs ──────────────────────
// These mimic the hand-drawn illustrated items in the Farmers' Market poster

const Pumpkin = () => (
  <div className="relative flex items-center justify-center">
    <div className="absolute inset-0 bg-orange-400/30 rounded-full blur-xl scale-110" />
    <svg
      viewBox="0 0 120 100"
      className="w-full h-full drop-shadow-2xl"
      fill="none"
    >
      {/* Body segments */}
      <ellipse cx="30" cy="65" rx="22" ry="28" fill="#e07b39" />
      <ellipse cx="60" cy="62" rx="26" ry="32" fill="#f0913e" />
      <ellipse cx="90" cy="65" rx="22" ry="28" fill="#e07b39" />
      <ellipse cx="45" cy="64" rx="18" ry="30" fill="#f0a04a" />
      <ellipse cx="75" cy="64" rx="18" ry="30" fill="#f0a04a" />
      {/* Lines */}
      <path
        d="M30 38 Q30 55 30 80"
        stroke="#c4622a"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M60 32 Q60 50 60 88"
        stroke="#c4622a"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M90 38 Q90 55 90 80"
        stroke="#c4622a"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
      {/* Stem */}
      <path d="M58 30 Q55 15 62 8 Q68 3 65 14 Q63 22 62 30" fill="#4a7c3f" />
      {/* Leaf */}
      <path d="M62 18 Q80 5 85 18 Q75 22 62 18Z" fill="#5a9e4a" />
    </svg>
  </div>
);

const HerbPot = () => (
  <div className="relative flex items-center justify-center">
    <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl scale-110" />
    <svg
      viewBox="0 0 100 130"
      className="w-full h-full drop-shadow-xl"
      fill="none"
    >
      {/* Pot */}
      <path d="M25 85 Q20 120 75 120 Q90 120 85 85 Z" fill="#d4826a" />
      <rect x="18" y="80" width="64" height="12" rx="4" fill="#c6735a" />
      {/* Soil */}
      <ellipse cx="50" cy="85" rx="32" ry="6" fill="#6b4423" />
      {/* Herb sprigs */}
      <path
        d="M35 80 Q30 55 28 35"
        stroke="#4a8c3f"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse
        cx="26"
        cy="30"
        rx="10"
        ry="14"
        fill="#5aaa4a"
        transform="rotate(-15 26 30)"
      />
      <path
        d="M50 80 Q48 50 46 25"
        stroke="#4a8c3f"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="44" cy="20" rx="10" ry="15" fill="#6bc05a" />
      <path
        d="M63 80 Q65 55 70 35"
        stroke="#4a8c3f"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse
        cx="72"
        cy="30"
        rx="10"
        ry="14"
        fill="#5aaa4a"
        transform="rotate(15 72 30)"
      />
      {/* Price tag */}
      <rect x="62" y="10" width="28" height="18" rx="3" fill="#e8b84b" />
      <text
        x="76"
        y="23"
        textAnchor="middle"
        fontSize="9"
        fill="#5a4010"
        fontWeight="bold"
      >
        ₹89
      </text>
    </svg>
  </div>
);

const Sunflower = () => (
  <div className="relative flex items-center justify-center">
    <div className="absolute inset-0 bg-yellow-400/25 rounded-full blur-xl scale-110" />
    <svg
      viewBox="0 0 100 140"
      className="w-full h-full drop-shadow-xl"
      fill="none"
    >
      {/* Stem */}
      <path
        d="M50 80 Q48 105 50 135"
        stroke="#4a8c3f"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Petals */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="50"
          rx="8"
          ry="22"
          fill={i % 2 === 0 ? "#f5c842" : "#f0b830"}
          transform={`rotate(${deg} 50 50)`}
          opacity="0.9"
        />
      ))}
      {/* Center */}
      <circle cx="50" cy="50" r="14" fill="#7a4010" />
      <circle cx="50" cy="50" r="10" fill="#5a2e08" />
      {/* Center dots */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <circle
          key={i}
          cx={50 + 6 * Math.cos((deg * Math.PI) / 180)}
          cy={50 + 6 * Math.sin((deg * Math.PI) / 180)}
          r="1.5"
          fill="#f5c842"
        />
      ))}
    </svg>
  </div>
);

const OliveOilBottle = () => (
  <div className="relative flex items-center justify-center">
    <div className="absolute inset-0 bg-green-400/15 rounded-full blur-xl scale-110" />
    <svg
      viewBox="0 0 70 140"
      className="w-full h-full drop-shadow-xl"
      fill="none"
    >
      {/* Bottle body */}
      <path
        d="M18 55 Q12 60 12 120 Q12 132 35 132 Q58 132 58 120 Q58 60 52 55Z"
        fill="#c2d870"
      />
      {/* Bottle shine */}
      <path
        d="M20 65 Q18 85 20 110"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* Neck */}
      <rect x="26" y="28" width="18" height="30" rx="4" fill="#a8c050" />
      {/* Cap */}
      <rect x="22" y="18" width="26" height="14" rx="6" fill="#8b3a1e" />
      {/* Label */}
      <rect
        x="16"
        y="72"
        width="38"
        height="45"
        rx="4"
        fill="white"
        opacity="0.85"
      />
      <text
        x="35"
        y="92"
        textAnchor="middle"
        fontSize="7"
        fill="#4a7c3f"
        fontWeight="bold"
      >
        olive
      </text>
      <text
        x="35"
        y="103"
        textAnchor="middle"
        fontSize="7"
        fill="#4a7c3f"
        fontWeight="bold"
      >
        oil
      </text>
      <path d="M20 108 L50 108" stroke="#a8c050" strokeWidth="1" />
    </svg>
  </div>
);

const MilkBottle = () => (
  <div className="relative flex items-center justify-center">
    <div className="absolute inset-0 bg-blue-100/30 rounded-full blur-xl scale-110" />
    <svg
      viewBox="0 0 80 140"
      className="w-full h-full drop-shadow-xl"
      fill="none"
    >
      {/* Bottle */}
      <path
        d="M22 50 Q14 58 14 120 Q14 133 40 133 Q66 133 66 120 Q66 58 58 50Z"
        fill="#f0f4ff"
      />
      <path
        d="M22 50 Q14 58 14 120 Q14 133 40 133 Q66 133 66 120 Q66 58 58 50Z"
        fill="white"
        opacity="0.6"
      />
      {/* Shine */}
      <path
        d="M22 65 Q20 90 22 115"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Neck */}
      <path
        d="M28 25 L28 50 L52 50 L52 25 Q52 18 40 18 Q28 18 28 25Z"
        fill="#e8ecff"
      />
      {/* Cap */}
      <ellipse cx="40" cy="20" rx="16" ry="8" fill="#e8c840" />
      {/* Label */}
      <rect x="18" y="68" width="44" height="50" rx="5" fill="#e8f0ff" />
      <text
        x="40"
        y="88"
        textAnchor="middle"
        fontSize="7"
        fill="#3a5c8a"
        fontWeight="bold"
      >
        Fresh
      </text>
      <text
        x="40"
        y="99"
        textAnchor="middle"
        fontSize="7"
        fill="#3a5c8a"
        fontWeight="bold"
      >
        Milk
      </text>
      <path d="M22 104 L58 104" stroke="#b0c8e8" strokeWidth="1" />
      {/* Cow doodle */}
      <circle
        cx="40"
        cy="114"
        r="6"
        fill="white"
        stroke="#3a5c8a"
        strokeWidth="1"
      />
    </svg>
  </div>
);

const EggCarton = () => (
  <div className="relative flex items-center justify-center">
    <div className="absolute inset-0 bg-yellow-300/20 rounded-full blur-xl scale-110" />
    <svg
      viewBox="0 0 110 75"
      className="w-full h-full drop-shadow-xl"
      fill="none"
    >
      {/* Carton base */}
      <rect x="5" y="28" width="100" height="42" rx="6" fill="#e8c97a" />
      {/* Carton top */}
      <rect x="5" y="15" width="100" height="18" rx="4" fill="#d4b060" />
      <path d="M5 28 L105 28" stroke="#b89840" strokeWidth="1.5" />
      {/* Egg dividers */}
      <path d="M40 28 L40 70" stroke="#b89840" strokeWidth="1.5" />
      <path d="M73 28 L73 70" stroke="#b89840" strokeWidth="1.5" />
      {/* Eggs */}
      <ellipse cx="22" cy="50" rx="13" ry="16" fill="#faf4e4" />
      <ellipse cx="57" cy="50" rx="13" ry="16" fill="#faf4e4" />
      <ellipse cx="89" cy="50" rx="13" ry="16" fill="#faf4e4" />
      {/* Egg shine */}
      <ellipse cx="17" cy="44" rx="4" ry="3" fill="white" opacity="0.5" />
      <ellipse cx="52" cy="44" rx="4" ry="3" fill="white" opacity="0.5" />
      <ellipse cx="84" cy="44" rx="4" ry="3" fill="white" opacity="0.5" />
    </svg>
  </div>
);

const FlowerBouquet = () => (
  <div className="relative flex items-center justify-center">
    <div className="absolute inset-0 bg-pink-300/20 rounded-full blur-xl scale-110" />
    <svg
      viewBox="0 0 100 130"
      className="w-full h-full drop-shadow-xl"
      fill="none"
    >
      {/* Vase */}
      <path d="M30 85 Q25 120 70 120 Q80 120 78 85Z" fill="#e89070" />
      <rect x="22" y="80" width="56" height="10" rx="4" fill="#d07050" />
      {/* Stems */}
      <path
        d="M40 80 Q38 65 35 50"
        stroke="#4a8c3f"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M50 80 Q50 60 50 40"
        stroke="#4a8c3f"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M60 80 Q62 65 65 50"
        stroke="#4a8c3f"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Flowers - Pink */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <ellipse
          key={i}
          cx="35"
          cy="48"
          rx="6"
          ry="10"
          fill="#f07090"
          transform={`rotate(${deg} 35 48)`}
          opacity="0.9"
        />
      ))}
      <circle cx="35" cy="48" r="6" fill="#f8d0e0" />
      {/* Orange flower */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="38"
          rx="6"
          ry="10"
          fill="#f09040"
          transform={`rotate(${deg} 50 38)`}
          opacity="0.9"
        />
      ))}
      <circle cx="50" cy="38" r="6" fill="#fce0b0" />
      {/* Blue flower */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <ellipse
          key={i}
          cx="65"
          cy="48"
          rx="6"
          ry="10"
          fill="#8090e0"
          transform={`rotate(${deg} 65 48)`}
          opacity="0.9"
        />
      ))}
      <circle cx="65" cy="48" r="6" fill="#d0d8f8" />
      {/* Leaves */}
      <path
        d="M42 70 Q35 60 40 55"
        stroke="#5a9e4a"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M58 70 Q65 60 60 55"
        stroke="#5a9e4a"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  </div>
);

const Watermelon = () => (
  <div className="relative flex items-center justify-center">
    <div className="absolute inset-0 bg-red-400/15 rounded-full blur-xl scale-110" />
    <svg
      viewBox="0 0 130 80"
      className="w-full h-full drop-shadow-xl"
      fill="none"
    >
      {/* Rind */}
      <path d="M5 70 Q5 5 65 5 Q125 5 125 70Z" fill="#5aaa3a" />
      {/* White layer */}
      <path d="M15 70 Q15 18 65 18 Q115 18 115 70Z" fill="#e8f8e0" />
      {/* Flesh */}
      <path d="M22 70 Q22 28 65 28 Q108 28 108 70Z" fill="#e84a6a" />
      {/* Seeds */}
      {[
        [42, 45],
        [58, 40],
        [72, 42],
        [55, 57],
        [78, 55],
        [38, 58],
      ].map(([x, y], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx="3"
          ry="5"
          fill="#1a2a10"
          transform={`rotate(${i * 30 - 15} ${x} ${y})`}
        />
      ))}
      {/* Shine */}
      <path
        d="M30 60 Q35 40 50 35"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  </div>
);

const LycheeGrapes = () => (
  <div className="relative flex items-center justify-center">
    <div className="absolute inset-0 bg-pink-400/15 rounded-full blur-xl scale-110" />
    <svg
      viewBox="0 0 100 110"
      className="w-full h-full drop-shadow-xl"
      fill="none"
    >
      {/* Stem */}
      <path
        d="M50 5 Q48 18 50 25"
        stroke="#4a7c3f"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Leaves top */}
      <path d="M50 12 Q65 5 70 15 Q60 18 50 12Z" fill="#5aaa4a" />
      <path d="M50 12 Q35 5 30 15 Q40 18 50 12Z" fill="#5aaa4a" />
      {/* Grapes cluster — pinkish lychee look */}
      {[
        [30, 42],
        [50, 42],
        [70, 42],
        [20, 58],
        [40, 58],
        [60, 58],
        [80, 58],
        [30, 74],
        [50, 74],
        [70, 74],
        [40, 90],
        [60, 90],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="14" fill="#e878b0" />
          <circle cx={x - 3} cy={y - 4} r="5" fill="white" opacity="0.35" />
        </g>
      ))}
    </svg>
  </div>
);

// Food illustrations array matching the reference poster
const POSTER_ITEMS = [
  // Top-left: Pumpkin harvest bowl
  {
    Component: Pumpkin,
    className:
      "w-28 sm:w-36 md:w-44 lg:w-52 top-[2%] left-[0%] md:left-[2%] lg:left-[3%]",
    delay: 0.0,
  },
  // Top-right: Herb pot with price tag
  {
    Component: HerbPot,
    className:
      "w-20 sm:w-28 md:w-36 lg:w-42 top-[1%] right-[2%] md:right-[4%] lg:right-[5%]",
    delay: 0.15,
  },
  // Right-mid: Sunflowers
  {
    Component: Sunflower,
    className:
      "w-16 sm:w-22 md:w-28 lg:w-34 top-[45%] right-[0%] md:right-[2%] lg:right-[3%]",
    delay: 0.3,
  },
  // Left-mid: Olive oil bottle
  {
    Component: OliveOilBottle,
    className:
      "w-10 sm:w-14 md:w-18 lg:w-22 top-[55%] left-[2%] md:left-[4%] lg:left-[5%]",
    delay: 0.45,
  },
  // Left bottom area: Milk bottle
  {
    Component: MilkBottle,
    className:
      "w-12 sm:w-16 md:w-20 lg:w-24 bottom-[5%] left-[6%] md:left-[8%] lg:left-[10%]",
    delay: 0.55,
  },
  // Left bottom: Egg carton
  {
    Component: EggCarton,
    className:
      "w-20 sm:w-28 md:w-36 lg:w-44 bottom-[0%] left-[0%] md:left-[1%]",
    delay: 0.65,
  },
  // Bottom-center-left: Flowers bouquet
  {
    Component: FlowerBouquet,
    className:
      "w-16 sm:w-20 md:w-26 lg:w-32 bottom-[2%] left-[25%] md:left-[28%]",
    delay: 0.7,
  },
  // Bottom-right: Watermelon
  {
    Component: Watermelon,
    className: "w-24 sm:w-32 md:w-40 lg:w-48 bottom-[0%] right-[0%]",
    delay: 0.8,
  },
  // Right bottom: Lychee grapes
  {
    Component: LycheeGrapes,
    className:
      "w-20 sm:w-26 md:w-32 lg:w-38 bottom-[14%] right-[3%] md:right-[6%]",
    delay: 0.85,
  },
];

export function FloatingFoodHero({
  title,
  description,
  className,
  children,
}: FloatingFoodHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);

    // Detect mobile (<=768px or touch device)
    const checkMobile = () =>
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      mediaQuery.removeEventListener("change", handler);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || reducedMotion || isMobile) return;
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      setMousePosition({ x, y });
    },
    [reducedMotion, isMobile],
  );

  const springConfig = { damping: 45, stiffness: 150 };
  const mouseX = useSpring(mousePosition.x, springConfig);
  const mouseY = useSpring(mousePosition.y, springConfig);

  // On mobile: show 5 key items to balance look & performance
  const visibleItems = useMemo(
    () =>
      isMobile
        ? [POSTER_ITEMS[0], POSTER_ITEMS[1], POSTER_ITEMS[2], POSTER_ITEMS[7], POSTER_ITEMS[8]]
        : POSTER_ITEMS,
    [isMobile],
  );

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full min-h-[90vh] md:min-h-[82vh] flex items-center justify-center overflow-hidden pt-24 pb-16 cursor-default",
        className,
      )}
    >
      {/* ── Thick teal border frame — exactly like the poster ── */}
      <div className="absolute inset-3 sm:inset-5 lg:inset-6 rounded-[2.5rem] sm:rounded-[3rem] border-[5px] sm:border-[6px] border-primary/75 pointer-events-none z-30" />

      {/* ── Illustrated food items scattered around the border ── */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {visibleItems.map((item, index) => {
          const { Component, className: posClassName, delay } = item;
          const moveX = ((index % 3) + 1) * 10;
          const moveY = ((index % 2) + 1) * 6;

          // On mobile: simple fade-in only, no float/parallax
          const animateProps =
            isMobile || reducedMotion
              ? { opacity: 1, scale: 1 }
              : {
                  opacity: 1,
                  scale: 1,
                  y: [0, -10, 0],
                  translateX: mouseX.get() * moveX,
                  translateY: mouseY.get() * moveY,
                };

          const transitionProps =
            isMobile || reducedMotion
              ? {
                  opacity: { duration: 0.5, delay: index * 0.1 },
                  scale: { duration: 0.5, delay: index * 0.1 },
                }
              : {
                  opacity: { duration: 0.8, delay },
                  scale: { duration: 0.8, delay },
                  y: {
                    duration: 3.5 + (index % 3) * 0.8,
                    repeat: Infinity,
                    ease: "easeInOut" as const,
                    delay: delay + 0.3,
                  },
                };

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={animateProps}
              transition={transitionProps}
              className={cn("absolute", posClassName)}
              style={{ willChange: "transform, opacity" }}
            >
              <Component />
            </motion.div>
          );
        })}
      </div>

      {/* ── Central Poster-Style Content ── */}
      <div className="relative z-20 container mx-auto px-6 text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          {/* Eyebrow — "COME AND JOIN US AT THE" */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-primary/80 text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] mb-1 sm:mb-2"
          >
            Come and experience
          </motion.p>

          {/* Main poster title — bold, large, two-line like "FARMERS' MARKET" */}
          <h1 className="font-heading text-foreground leading-none mb-4 sm:mb-5">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="block text-[2.8rem] sm:text-[3.8rem] md:text-[5rem] lg:text-[6rem] text-primary"
            >
              Bhojanālaya's
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="block text-[2.2rem] sm:text-[3rem] md:text-[4rem] lg:text-[4.8rem] text-foreground"
            >
              Finest Flavours
            </motion.span>
          </h1>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-3 my-3 sm:my-4"
          >
            <div className="h-px w-12 sm:w-20 bg-primary/40 rounded-full" />
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <div className="h-px w-12 sm:w-20 bg-primary/40 rounded-full" />
          </motion.div>

          {/* Body copy — "Open Saturdays Year Round!" style */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="font-sans text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground max-w-md mx-auto mb-4"
          >
            {description}
          </motion.p>

          {/* "SEE YOU THERE!" style CTA text */}
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="font-heading text-primary text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-8"
          >
            See You There!
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
