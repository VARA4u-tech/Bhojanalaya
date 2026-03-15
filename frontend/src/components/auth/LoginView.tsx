import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { cn } from "@/lib/utils";

// --- High-Fidelity SVG Illustrations (Corrected Gaps and Scaling) ---

const Pumpkin = () => (
  <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-2xl" fill="none" preserveAspectRatio="xMidYMid meet">
    <ellipse cx="30" cy="65" rx="22" ry="28" fill="#e07b39" />
    <ellipse cx="60" cy="62" rx="26" ry="32" fill="#f0913e" />
    <ellipse cx="90" cy="65" rx="22" ry="28" fill="#e07b39" />
    <ellipse cx="45" cy="64" rx="18" ry="30" fill="#f0a04a" />
    <ellipse cx="75" cy="64" rx="18" ry="30" fill="#f0a04a" />
    <path d="M58 30 Q55 15 62 8 Q68 3 65 14 Q63 22 62 30" fill="#4a7c3f" />
    <path d="M62 18 Q80 5 85 18 Q75 22 62 18Z" fill="#5a9e4a" />
  </svg>
);

const HerbPot = () => (
  <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-xl" fill="none" preserveAspectRatio="xMidYMid meet">
    {/* Pot (Moved up slightly to close any gaps) */}
    <path d="M25 80 Q20 115 75 115 Q90 115 85 80 Z" fill="#d4826a" />
    <rect x="18" y="75" width="64" height="12" rx="4" fill="#c6735a" />
    <ellipse cx="50" cy="80" rx="32" ry="6" fill="#6b4423" />
    {/* Sprigs */}
    <path d="M35 78 Q30 55 28 35" stroke="#4a8c3f" strokeWidth="3" strokeLinecap="round" fill="none" />
    <ellipse cx="26" cy="30" rx="10" ry="14" fill="#5aaa4a" transform="rotate(-15 26 30)" />
    <path d="M50 78 Q48 50 46 25" stroke="#4a8c3f" strokeWidth="3" strokeLinecap="round" fill="none" />
    <ellipse cx="44" cy="20" rx="10" ry="15" fill="#6bc05a" />
    <path d="M63 78 Q65 55 70 35" stroke="#4a8c3f" strokeWidth="3" strokeLinecap="round" fill="none" />
    <ellipse cx="72" cy="30" rx="10" ry="14" fill="#5aaa4a" transform="rotate(15 72 30)" />
    {/* Tag */}
    <rect x="62" y="10" width="28" height="18" rx="3" fill="#e8b84b" />
    <text x="76" y="23" textAnchor="middle" fontSize="9" fill="#5a4010" fontWeight="bold">₹89</text>
  </svg>
);

const Sunflower = () => (
  <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-xl" fill="none" preserveAspectRatio="xMidYMid meet">
    {/* Stem (Adjusted to meet head) */}
    <path d="M50 70 Q48 105 50 135" stroke="#4a8c3f" strokeWidth="4" strokeLinecap="round" fill="none" />
    {/* Head - BIG petals first to ensure visibility */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
      <ellipse key={i} cx="50" cy="50" rx="12" ry="35" fill={i % 2 === 0 ? "#f5c842" : "#f0b830"} transform={`rotate(${deg} 50 50)`} />
    ))}
    <circle cx="50" cy="50" r="18" fill="#7a4010" />
    <circle cx="50" cy="50" r="14" fill="#5a2e08" />
    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
      <circle key={i} cx={50 + 8 * Math.cos((deg * Math.PI) / 180)} cy={50 + 8 * Math.sin((deg * Math.PI) / 180)} r="2" fill="#f5c842" />
    ))}
  </svg>
);

const EggCarton = () => (
  <svg viewBox="0 0 110 75" className="w-full h-full drop-shadow-xl" fill="none" preserveAspectRatio="xMidYMid meet">
    <rect x="5" y="28" width="100" height="42" rx="6" fill="#e8c97a" />
    <rect x="5" y="15" width="100" height="18" rx="4" fill="#d4b060" />
    <path d="M5 28 L105 28" stroke="#b89840" strokeWidth="1.5" />
    <ellipse cx="22" cy="50" rx="13" ry="16" fill="#faf4e4" />
    <ellipse cx="57" cy="50" rx="13" ry="16" fill="#faf4e4" />
    <ellipse cx="89" cy="50" rx="13" ry="16" fill="#faf4e4" />
  </svg>
);

const Watermelon = () => (
  <svg viewBox="0 0 130 80" className="w-full h-full drop-shadow-xl" fill="none" preserveAspectRatio="xMidYMid meet">
    <path d="M5 70 Q5 5 65 5 Q125 5 125 70Z" fill="#5aaa3a" />
    <path d="M15 70 Q15 18 65 18 Q115 18 115 70Z" fill="#e8f8e0" />
    <path d="M22 70 Q22 28 65 28 Q108 28 108 70Z" fill="#e84a6a" />
    {[[42, 45], [58, 40], [72, 42], [55, 57], [78, 55], [38, 58]].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx="3" ry="5" fill="#1a2a10" transform={`rotate(${i * 30 - 15} ${x} ${y})`} />
    ))}
  </svg>
);

const POSTER_ITEMS = [
  { Component: Pumpkin, className: "w-28 sm:w-44 top-[2%] left-[1%]", delay: 0 },
  { Component: HerbPot, className: "w-24 sm:w-36 top-[1%] right-[2%]", delay: 0.2 },
  { Component: Sunflower, className: "w-20 sm:w-32 bottom-[2%] right-[2%]", delay: 0.4 },
  { Component: EggCarton, className: "w-16 sm:w-28 bottom-[1%] left-[2%]", delay: 0.6 },
  { Component: Watermelon, className: "w-20 sm:w-36 top-[45%] right-[-1%]", delay: 0.8 },
];

export function LoginView() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const navigate = useNavigate();
  const { loginWithGoogle } = useUserStore();
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    document.body.style.overflow = 'hidden';
    return () => { 
      document.body.style.overflow = 'unset';
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const visibleItems = isMobile ? [POSTER_ITEMS[0], POSTER_ITEMS[2]] : POSTER_ITEMS;

  return (
    <div className="absolute inset-0 z-[45] flex items-center justify-center bg-[#d9ede1] p-4 sm:p-10 overflow-y-auto font-sans">
      
      {/* Frame - TOP LAYER - Neater Inset */}
      <div className="fixed inset-2 sm:inset-5 lg:inset-8 rounded-[1.5rem] sm:rounded-[3rem] border-[3px] sm:border-[12px] border-primary/90 pointer-events-none z-[75]" />

      {/* Decorations - STYLED TOP LAYER */}
      <div className="absolute inset-0 pointer-events-none z-[60] overflow-hidden">
        {visibleItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: item.delay }}
            className={cn("absolute", item.className)}
          >
            <motion.div
              animate={isMobile ? {} : { y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 7 + index, repeat: Infinity, ease: "easeInOut" }}
              className={isMobile ? "" : "drop-shadow-xl"}
            >
               <item.Component />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Auth Card */}
      <div className="relative z-50 w-full max-w-[460px] my-auto py-20 lg:py-32">
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, ease: "easeOut" }}
            className="bg-white p-6 sm:p-14 rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.15)] border-4 border-primary/5"
        >
          <div className="text-center mb-6 sm:mb-12">
             <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-primary shadow-lg shadow-primary/20 text-white mb-4 sm:mb-8">
               <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
             </div>
             <h1 className="font-heading text-2xl sm:text-4xl text-primary mb-1 sm:mb-2 capitalize">
               {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
             </h1>
             <p className="font-serif italic text-muted-foreground">
               Bhojanālaya • Premium Organic Dining
             </p>
          </div>

          {/* Switcher */}
          <div className="flex p-1.5 bg-muted/30 rounded-3xl mb-6 sm:mb-10 border-2 border-primary/10">
            <button
              onClick={() => setActiveTab("login")}
              className={cn(
                "flex-1 py-3 text-sm font-bold rounded-2xl transition-all",
                activeTab === "login" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={cn(
                "flex-1 py-3 text-sm font-bold rounded-2xl transition-all",
                activeTab === "signup" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed px-4">
                  {activeTab === 'login' 
                    ? "Welcome back to Bhojanālaya. Access your account securely and continue your organic dining journey."
                    : "Join our farm-to-table community. Create your account in seconds to start ordering premium organic meals."}
                </p>
                
                <div className="grid grid-cols-1 gap-3 py-4">
                  {[
                    { icon: Sparkles, text: "Instant Secure Access" },
                    { icon: ArrowRight, text: activeTab === 'login' ? "Resume Your Orders" : "Unlock Member Benefits" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary/60">
                      <item.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative group">
                {/* Decorative Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-[2rem] blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                
                <button
                  type="button"
                  onClick={() => loginWithGoogle()}
                  className="relative w-full h-16 sm:h-20 rounded-[2rem] bg-white border-2 border-primary/20 shadow-xl hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex items-center justify-center gap-4 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-muted/10 group-hover:bg-primary/5 transition-colors">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  <div className="flex flex-col items-start translate-y-[-1px]">
                    <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">
                      One-Tap Secure
                    </span>
                    <span className="text-lg sm:text-xl font-heading text-primary group-hover:scale-105 transition-transform">
                      {activeTab === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                    </span>
                  </div>
                </button>
              </div>

              <p className="text-[10px] text-center text-muted-foreground/60 leading-relaxed max-w-[280px] mx-auto">
                By continuing, you agree to Bhojanālaya&apos;s <span className="underline cursor-pointer hover:text-primary">Terms</span> and <span className="underline cursor-pointer hover:text-primary">Privacy Policy</span>.
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        onClick={() => navigate("/")}
        className="fixed top-6 right-6 sm:top-14 sm:right-14 z-[100] w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center border-4 border-white"
      >
        <X className="w-5 h-5 sm:w-7 sm:w-7" />
      </motion.button>
    </div>
  );
}
