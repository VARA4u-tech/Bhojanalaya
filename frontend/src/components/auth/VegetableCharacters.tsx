import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const customStyles = `
@keyframes slow-pan {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-slow-pan {
  animation: slow-pan 120s linear infinite;
  width: 200%;
}
@keyframes sway-subtle {
  0%, 100% { transform: rotate(-1deg); }
  50% { transform: rotate(1deg); }
}
.sway-item {
  animation: sway-subtle 6s ease-in-out infinite;
  transform-origin: bottom center;
}
.premium-noise {
  background-image: url("https://www.transparenttextures.com/patterns/pinstriped-suit.png");
  opacity: 0.03;
}
`;

// Premium Botanical Lighting & Textures
const BotanicalGlow = ({ color }: { color: string }) => (
  <div
    className="absolute inset-0 opacity-30 blur-3xl pointer-events-none"
    style={{
      background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
    }}
  />
);

const BotanicalShadow = () => (
  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-4 bg-black/10 blur-xl rounded-[100%] z-[-1]" />
);

const CharacterWrapper = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    animate={{
      y: [0, -8, 0],
      rotate: [-1, 1, -1],
    }}
    transition={{
      duration: 5 + delay,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
    className={`relative group cursor-pointer origin-bottom ${className}`}
  >
    <motion.div
      whileHover={{
        scale: 1.08,
        y: -10,
        transition: { type: "spring", stiffness: 300, damping: 15 },
      }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  </motion.div>
);

// Redesigned Artistic Botanical Illustrations
function ArtisticTomato() {
  return (
    <CharacterWrapper>
      <div className="relative flex flex-col items-center">
        <BotanicalGlow color="#ff4d4d" />
        <div
          className="relative w-36 h-32 rounded-[48%_48%_52%_52%] flex items-center justify-center border border-white/10"
          style={{
            background:
              "radial-gradient(circle at 35% 25%, #ef5350 0%, #c62828 40%, #5d0000 100%)",
            boxShadow:
              "inset -8px -8px 20px rgba(0,0,0,0.3), inset 8px 8px 20px rgba(255,255,255,0.1), 0 15px 30px rgba(0,0,0,0.2)",
          }}
        >
          <div className="absolute top-[10%] left-[15%] w-12 h-6 rounded-[50%] bg-white/20 rotate-[-25deg] blur-md mix-blend-overlay"></div>
          <div className="absolute -top-7 w-12 h-12">
            <svg viewBox="0 0 100 100" className="opacity-90">
              <path
                fill="#2e7d32"
                d="M50 45 C30 65, 10 35, 20 20 C30 10, 40 30, 50 35 C60 30, 70 10, 80 20 C90 35, 70 65, 50 45 Z"
              />
              <path
                fill="#1b5e20"
                d="M48 40 C48 15, 50 5, 50 5 C50 5, 52 15, 52 40 Z"
              />
            </svg>
          </div>
        </div>
        <BotanicalShadow />
      </div>
    </CharacterWrapper>
  );
}

function ArtisticEggplant() {
  return (
    <CharacterWrapper delay={0.4}>
      <div className="relative flex flex-col items-center">
        <BotanicalGlow color="#9c27b0" />
        <div
          className="relative w-24 h-36 border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.25)]"
          style={{
            borderRadius: "50% 50% 45% 45% / 70% 70% 35% 35%",
            background:
              "radial-gradient(ellipse at 40% 30%, #ce93d8 0%, #7b1fa2 45%, #4a148c 100%)",
            boxShadow:
              "inset -10px -10px 20px rgba(0,0,0,0.4), inset 10px 10px 20px rgba(255,255,255,0.1)",
          }}
        >
          <div className="absolute top-[10%] left-[20%] w-6 h-10 rounded-[50%] bg-white/15 rotate-[15deg] blur-md mix-blend-overlay"></div>
          <div className="absolute -top-4 w-12 h-10">
            <svg viewBox="0 0 100 100" className="opacity-80">
              <path fill="#1b5e20" d="M45,0 L55,0 L55,40 L45,40 Z" />
              <path
                fill="#2e7d32"
                d="M10,40 Q50,-10 90,40 Q70,70 50,55 Q30,70 10,40 Z"
              />
            </svg>
          </div>
        </div>
        <BotanicalShadow />
      </div>
    </CharacterWrapper>
  );
}

function ArtisticOrange() {
  return (
    <CharacterWrapper delay={0.8}>
      <div className="relative flex flex-col items-center">
        <BotanicalGlow color="#ff9800" />
        <div
          className="relative w-28 h-28 rounded-full border border-white/20 shadow-[0_15px_30px_rgba(0,0,0,0.2)]"
          style={{
            background:
              "radial-gradient(circle at 35% 25%, #ffb74d 0%, #f57c00 50%, #e65100 100%)",
            boxShadow:
              "inset -8px -8px 15px rgba(0,0,0,0.3), inset 8px 8px 20px rgba(255,255,255,0.2)",
          }}
        >
          <div className="absolute top-[12%] left-[20%] w-8 h-8 bg-white/20 rounded-full blur-md"></div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1b5e20] rounded-full" />
        </div>
        <BotanicalShadow />
      </div>
    </CharacterWrapper>
  );
}

function ArtisticAvocado() {
  return (
    <CharacterWrapper delay={0.2}>
      <div className="relative flex flex-col items-center">
        <BotanicalGlow color="#4caf50" />
        <div
          className="relative w-32 h-44 border-[5px] border-[#1b2b10] shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
          style={{
            borderRadius: "50% 50% 45% 45% / 60% 60% 40% 40%",
            background:
              "radial-gradient(circle at 45% 40%, #e8f5e9 0%, #a5d6a7 45%, #388e3c 100%)",
          }}
        >
          <div className="absolute top-[8%] right-[20%] w-10 h-16 bg-white/10 rounded-[50%] rotate-[20deg] blur-lg"></div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #8d6e63 0%, #4e342e 50%, #2b1d1d 100%)",
              boxShadow: "inset -5px -5px 10px rgba(0,0,0,0.3)",
            }}
          />
        </div>
        <BotanicalShadow />
      </div>
    </CharacterWrapper>
  );
}

function ArtisticApple() {
  return (
    <CharacterWrapper delay={0.6}>
      <div className="relative flex flex-col items-center">
        <BotanicalGlow color="#ef5350" />
        <div
          className="relative w-28 h-28 rounded-[50%_50%_45%_45%/60%_60%_40%_40%] border border-white/20 shadow-[0_15px_30px_rgba(0,0,0,0.2)]"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, #ef5350 0%, #c62828 45%, #5d0000 100%)",
            boxShadow:
              "inset -8px -8px 15px rgba(0,0,0,0.3), inset 8px 8px 15px rgba(255,255,255,0.15)",
          }}
        >
          <div className="absolute top-[15%] left-[15%] w-8 h-5 rounded-[50%] bg-white/20 rotate-[-20deg] blur-md mix-blend-overlay"></div>
          <div className="absolute -top-5 w-2 h-8 bg-gradient-to-b from-[#5d4037] to-[#3e2723] rounded-full rotate-[15deg]" />
        </div>
        <BotanicalShadow />
      </div>
    </CharacterWrapper>
  );
}

// Environment Elements
function AtmosphericSun({ isNight }: { isNight: boolean }) {
  if (isNight) {
    return (
      <div className="relative">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute inset-[-40px] bg-sky-400/10 blur-3xl rounded-full"
        />
        <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-400 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)] relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 blur-[1px]" />
          <div className="absolute top-2 left-4 w-12 h-12 bg-[#0a0f1e] rounded-full" />
        </div>
      </div>
    );
  }
  return (
    <div className="relative">
      <motion.div
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute inset-[-50px] bg-yellow-400/20 blur-[50px] rounded-full"
      />
      <div className="w-20 h-20 bg-gradient-to-br from-yellow-200 via-amber-400 to-orange-500 rounded-full shadow-[0_0_50px_rgba(251,191,36,0.3)]" />
    </div>
  );
}

function GroundedRealisticFarmEnvironment({ isLogin }: { isLogin: boolean }) {
  const isNight = !isLogin;
  const stars = useMemo(() => {
    return [...Array(40)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 60}%`,
      size: Math.random() > 0.8 ? 2 : 1,
      opacity: 0.1 + Math.random() * 0.4,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div
      className={`absolute inset-0 w-full h-full transition-colors duration-1000 ${isNight ? "bg-[#0a0f1e]" : "bg-[#f1f5f9]"}`}
    >
      <style>{customStyles}</style>

      {/* Premium Texture Overlay */}
      <div className="absolute inset-0 premium-noise z-[5] pointer-events-none" />

      {/* Atmospheric Gradients */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${isNight ? "opacity-100" : "opacity-0"}`}
        style={{
          background:
            "radial-gradient(circle at center, #1e293b 0%, #0a0f1e 100%)",
        }}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${isNight ? "opacity-0" : "opacity-100"}`}
        style={{
          background:
            "radial-gradient(circle at center, #ffffff 0%, #f1f5f9 100%)",
        }}
      />

      {/* Hero Glow */}
      <div
        className={`absolute top-0 left-0 w-full h-full opacity-40 transition-opacity duration-1000 ${isNight ? "bg-[radial-gradient(circle_at_20%_20%,_rgba(56,189,248,0.05),_transparent_70%)]" : "bg-[radial-gradient(circle_at_20%_20%,_rgba(254,240,138,0.2),_transparent_70%)]"}`}
      />

      {/* Night Sky */}
      {isNight && (
        <div className="absolute inset-0 z-0">
          {stars.map((star) => (
            <motion.div
              key={star.id}
              animate={{
                opacity: [star.opacity, star.opacity * 2, star.opacity],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: star.delay,
              }}
              className="absolute bg-white rounded-full"
              style={{
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
              }}
            />
          ))}
        </div>
      )}

      {/* High-End Hills */}
      <div className="absolute bottom-0 w-full h-[30%] overflow-hidden pointer-events-none opacity-40">
        <div
          className={`absolute bottom-[-10%] left-[-10%] w-[120%] h-full rounded-[100%] blur-[80px] transition-colors ${isNight ? "bg-emerald-900" : "bg-green-200"}`}
        />
        <div
          className={`absolute bottom-[-20%] left-[20%] w-[100%] h-full rounded-[100%] blur-[100px] transition-colors ${isNight ? "bg-cyan-900" : "bg-sky-200"}`}
        />
      </div>

      {/* Sun/Moon */}
      <div className="absolute top-[10%] left-[10%] z-10 scale-75 md:scale-100">
        <AtmosphericSun isNight={isNight} />
      </div>

      {/* Foreground Gradient */}
      <div
        className={`absolute bottom-0 w-full h-1/4 z-10 transition-colors ${isNight ? "bg-gradient-to-t from-[#0a0f1e] to-transparent" : "bg-gradient-to-t from-white to-transparent"}`}
      />
    </div>
  );
}

export function VegetableHero({
  variant = "login",
  children,
  fullScreen = false,
}: {
  variant?: "login" | "signup";
  children?: React.ReactNode;
  fullScreen?: boolean;
}) {
  const isLogin = variant === "login";

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden ${fullScreen ? "w-full h-[100vh]" : "w-full h-[800px] rounded-3xl"}`}
    >
      <GroundedRealisticFarmEnvironment isLogin={isLogin} />

      {/* Card Content Overlay */}
      {children && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex items-center justify-center"
          >
            {children}
          </motion.div>
        </div>
      )}

      {/* Botanical Accents - Arranged Artistaclly */}
      <div className="absolute bottom-12 left-0 w-full flex justify-between px-12 z-40 pointer-events-none opacity-80 scale-75 md:scale-100">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login-accents"
              className="flex w-full justify-between items-end"
            >
              <div className="translate-y-4">
                <ArtisticEggplant />
              </div>
              <div className="translate-y-8">
                <ArtisticTomato />
              </div>
              <div className="translate-y-4">
                <ArtisticOrange />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="signup-accents"
              className="flex w-full justify-between items-end"
            >
              <div className="translate-y-6">
                <ArtisticApple />
              </div>
              <div className="translate-y-12">
                <ArtisticAvocado />
              </div>
              <div className="translate-y-6">
                <ArtisticTomato />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
