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
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
}
.sway-item {
  animation: sway-subtle 4s ease-in-out infinite;
  transform-origin: bottom center;
}
.grass-pattern {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.03) 10px,
    rgba(255, 255, 255, 0.03) 20px
  );
}
`;

function Eye({
  mouseX,
  mouseY,
  eyeSize = 32,
  pupilSize = 14,
}: {
  mouseX: number;
  mouseY: number;
  eyeSize?: number;
  pupilSize?: number;
}) {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const updateEye = () => {
      if (!eyeRef.current) return;
      const rect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;
      const dx = mouseX - eyeCenterX;
      const dy = mouseY - eyeCenterY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.hypot(dx, dy);
      const maxOffset = (eyeSize - pupilSize) / 2 - 2;
      const distanceFactor = Math.min(distance / 200, 1);
      setOffset({
        x: Math.cos(angle) * maxOffset * distanceFactor,
        y: Math.sin(angle) * maxOffset * distanceFactor,
      });
    };
    const animationFrameId = requestAnimationFrame(updateEye);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mouseX, mouseY, eyeSize, pupilSize]);

  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        if (Math.random() > 0.6) {
          setIsBlinking(true);
          setTimeout(() => setIsBlinking(false), 150);
        }
      },
      3000 + Math.random() * 2000,
    );
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div
      ref={eyeRef}
      className="bg-white rounded-full relative overflow-hidden flex items-center justify-center border border-white/40 shadow-[inset_1px_2px_4px_rgba(0,0,0,0.15)]"
      style={{ width: eyeSize, height: eyeSize }}
    >
      <div
        className={`w-full h-full bg-[#1e1e1e] absolute z-10 origin-top transition-transform duration-100 ${isBlinking ? "scale-y-100" : "scale-y-0"}`}
      />
      <div
        className="bg-[#1e1e1e] rounded-full absolute transition-transform ease-out duration-75 shadow-inner"
        style={{
          width: pupilSize,
          height: pupilSize,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        <div className="absolute top-[15%] left-[15%] w-[35%] h-[35%] bg-white rounded-full opacity-90 blur-[0.5px]" />
      </div>
    </div>
  );
}

const CharacterLimbs = ({ color = "#4a0000" }) => (
  <div className="absolute inset-0 z-[-1] pointer-events-none">
    {/* Left Arm */}
    <svg
      className="absolute top-[35%] -left-10 w-12 h-16 overflow-visible drop-shadow-sm"
      viewBox="0 0 100 100"
    >
      <path
        d="M100 40 Q 40 20, 20 80"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle cx="20" cy="80" r="10" fill={color} />
    </svg>
    {/* Right Arm */}
    <svg
      className="absolute top-[35%] -right-10 w-12 h-16 overflow-visible drop-shadow-sm"
      viewBox="0 0 100 100"
    >
      <path
        d="M0 40 Q 60 20, 80 80"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle cx="80" cy="80" r="10" fill={color} />
    </svg>
    {/* Left Leg */}
    <svg
      className="absolute -bottom-10 left-[20%] w-10 h-14 overflow-visible drop-shadow-sm"
      viewBox="0 0 100 100"
    >
      <path
        d="M50 0 Q 40 40, 40 70"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M40 70 Q 10 80, 5 85"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
    {/* Right Leg */}
    <svg
      className="absolute -bottom-10 right-[20%] w-10 h-14 overflow-visible drop-shadow-sm"
      viewBox="0 0 100 100"
    >
      <path
        d="M50 0 Q 60 40, 60 70"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M60 70 Q 90 80, 95 85"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const CharacterShadow = () => (
  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-6 bg-black/30 blur-[6px] rounded-[100%] z-[-2]" />
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
    animate={{ rotate: [-1, 1, -1], scale: [0.99, 1.01, 0.99] }}
    transition={{
      duration: 4 + delay / 2,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
    className={`relative group cursor-pointer origin-bottom ${className}`}
  >
    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  </motion.div>
);

// High-detail Realistic Characters
function RealisticTomato({ mousePos }: { mousePos: { x: number; y: number } }) {
  return (
    <CharacterWrapper>
      <div className="relative flex flex-col items-center z-10">
        <div
          className="relative w-44 h-40 rounded-[48%_48%_52%_52%_/_50%_50%_48%_48%] flex flex-col items-center justify-center shadow-[inset_-15px_-15px_30px_rgba(0,0,0,0.3),inset_15px_15px_30px_rgba(255,255,255,0.2),0_15px_20px_rgba(0,0,0,0.2)]"
          style={{
            background:
              "radial-gradient(circle at 35% 25%, #ff5252 0%, #d32f2f 50%, #8e0000 100%)",
          }}
        >
          <CharacterLimbs color="#5d0000" />
          <div className="absolute top-[10%] left-[15%] w-12 h-6 rounded-[50%] bg-white/40 rotate-[-20deg] blur-md mix-blend-overlay"></div>
          <div className="absolute -top-10 w-20 h-20">
            <svg viewBox="0 0 100 100" className="drop-shadow-md">
              <path
                fill="url(#stemGradTomato)"
                d="M50 45 C30 65, 10 35, 20 20 C30 10, 40 30, 50 35 C60 30, 70 10, 80 20 C90 35, 70 65, 50 45 Z"
              />
              <path
                fill="#1b5e20"
                d="M48 40 C48 15, 50 5, 50 5 C50 5, 52 15, 52 40 Z"
              />
              <defs>
                <radialGradient id="stemGradTomato" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#4caf50" />
                  <stop offset="100%" stopColor="#1b5e20" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          <div className="flex gap-4 mt-8">
            <Eye
              mouseX={mousePos.x}
              mouseY={mousePos.y}
              eyeSize={42}
              pupilSize={20}
            />
            <Eye
              mouseX={mousePos.x}
              mouseY={mousePos.y}
              eyeSize={42}
              pupilSize={20}
            />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <div className="w-8 h-3 border-b-4 border-[#3a0000] rounded-b-full opacity-80" />
            <div className="w-3 h-1.5 bg-[#ffcdd2] rounded-full mt-1 opacity-50 blur-[0.5px]" />
          </div>
        </div>
        <CharacterShadow />
      </div>
    </CharacterWrapper>
  );
}

function RealisticEggplant({
  mousePos,
}: {
  mousePos: { x: number; y: number };
}) {
  return (
    <CharacterWrapper delay={0.5}>
      <div className="relative flex flex-col items-center z-10">
        <div
          className="relative w-32 h-44 flex flex-col items-center justify-end pb-4 border-[4px]"
          style={{
            borderRadius: "50% 50% 45% 45% / 70% 70% 35% 35%",
            borderColor: "#311b92",
            background:
              "radial-gradient(ellipse at 40% 30%, #ce93d8 0%, #7b1fa2 45%, #4a148c 100%)",
            boxShadow:
              "inset -15px -15px 30px rgba(0,0,0,0.5), inset 15px 15px 30px rgba(255,255,255,0.2), 0 15px 20px rgba(0,0,0,0.3)",
          }}
        >
          <CharacterLimbs color="#311b92" />
          <div className="absolute top-[10%] left-[20%] w-6 h-12 rounded-[50%] bg-white/30 rotate-[15deg] blur-[2px] pointer-events-none mix-blend-overlay"></div>

          {/* Eggplant cap / stem */}
          <div className="absolute -top-6 w-16 h-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
            <svg viewBox="0 0 100 100">
              <path fill="#1b5e20" d="M45,0 L55,0 L55,40 L45,40 Z" />
              <path
                fill="#2e7d32"
                d="M10,40 Q50,-10 90,40 Q70,70 50,55 Q30,70 10,40 Z"
              />
              <path fill="#4caf50" d="M30,30 L50,10 L70,30 L50,50 Z" />
              <path fill="#1b5e20" d="M40,0 L60,0 L50,30 Z" />
            </svg>
          </div>

          <div className="flex gap-3 mb-2 z-20">
            <Eye
              mouseX={mousePos.x}
              mouseY={mousePos.y}
              eyeSize={32}
              pupilSize={16}
            />
            <Eye
              mouseX={mousePos.x}
              mouseY={mousePos.y}
              eyeSize={32}
              pupilSize={16}
            />
          </div>
          <div className="mt-2 w-5 h-2.5 border-b-4 border-[#1a0033] rounded-b-full opacity-80 z-20" />
        </div>
        <CharacterShadow />
      </div>
    </CharacterWrapper>
  );
}

function RealisticApple({ mousePos }: { mousePos: { x: number; y: number } }) {
  return (
    <CharacterWrapper delay={0.5}>
      <div className="relative flex flex-col items-center z-10">
        <div
          className="relative w-36 h-36 rounded-[50%_50%_45%_45%/60%_60%_40%_40%] flex flex-col items-center justify-center shadow-[inset_-12px_-12px_20px_rgba(0,0,0,0.4),inset_10px_10px_20px_rgba(255,255,255,0.2),0_15px_20px_rgba(0,0,0,0.2)]"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, #ef5350 0%, #c62828 50%, #5d0000 100%)",
          }}
        >
          <CharacterLimbs color="#5d0000" />
          <div className="absolute top-[12%] left-[15%] w-8 h-4 rounded-[50%] bg-white/40 rotate-[-20deg] blur-md mix-blend-overlay"></div>
          <div className="absolute -top-7 w-3 h-10 bg-gradient-to-b from-[#5d4037] to-[#3e2723] rounded-t-sm rotate-[15deg] shadow-lg" />
          <div className="absolute -top-4 left-5 w-12 h-6 rounded-[0_100%_0_100%] rotate-[-25deg] shadow-md border border-black/10 bg-gradient-to-br from-[#81c784] to-[#2e7d32]" />
          <div className="flex gap-3 mt-6">
            <Eye
              mouseX={mousePos.x}
              mouseY={mousePos.y}
              eyeSize={32}
              pupilSize={16}
            />
            <Eye
              mouseX={mousePos.x}
              mouseY={mousePos.y}
              eyeSize={32}
              pupilSize={16}
            />
          </div>
          <div className="mt-3 w-5 h-2 bg-[#4a0000] rounded-b-full opacity-70" />
        </div>
        <CharacterShadow />
      </div>
    </CharacterWrapper>
  );
}

function RealisticSteak({ mousePos }: { mousePos: { x: number; y: number } }) {
  return (
    <CharacterWrapper delay={1.2}>
      <div className="relative flex flex-col items-center z-10">
        <div
          className="relative w-48 h-36 rounded-[35%_65%_70%_35%/40%_50%_60%_50%] flex flex-col items-center justify-center p-2 border-4 border-[#b71c1c] shadow-[inset_-10px_-10px_25px_rgba(0,0,0,0.5),inset_10px_10px_20px_rgba(255,255,255,0.15),0_15px_20px_rgba(0,0,0,0.2)]"
          style={{
            background:
              "radial-gradient(ellipse at center, #e53935 0%, #c62828 50%, #5d0000 100%)",
          }}
        >
          <CharacterLimbs color="#5d0000" />
          {/* Marbling details */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MiIgaGVpZ2h0PSI0MiI+PGNpcmNsZSBjeD0iMjEiIGN5PSIyMSIgcj0iMjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiLz48L3N2Zz4=')] opacity-50 rounded-[inherit]"></div>
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-16 bg-[#fff3e0] rounded-l-full shadow-[inset_-2px_0_10px_rgba(0,0,0,0.3)] border-r border-black/10" />
          <div className="absolute top-[25%] left-[20%] w-14 h-2 bg-white/30 rounded-full rotate-12 blur-[1px]"></div>
          <div className="absolute bottom-[30%] right-[15%] w-16 h-1.5 bg-white/20 rounded-full -rotate-12 blur-[1px]"></div>

          <div className="flex gap-4 mt-2 ml-4">
            <Eye
              mouseX={mousePos.x}
              mouseY={mousePos.y}
              eyeSize={36}
              pupilSize={18}
            />
            <Eye
              mouseX={mousePos.x}
              mouseY={mousePos.y}
              eyeSize={36}
              pupilSize={18}
            />
          </div>
          <div className="mt-2 ml-4 w-6 h-1 border-b-4 border-[#3a0000] rounded-b-full opacity-60" />
        </div>
        <CharacterShadow />
      </div>
    </CharacterWrapper>
  );
}

function RealisticAvocado({
  mousePos,
}: {
  mousePos: { x: number; y: number };
}) {
  return (
    <CharacterWrapper delay={0}>
      <div className="relative flex flex-col items-center z-10">
        <div
          className="relative w-40 h-56 flex flex-col items-center justify-end pb-6 border-[8px] shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.2),inset_10px_10px_20px_rgba(255,255,255,0.4),0_15px_20px_rgba(0,0,0,0.2)]"
          style={{
            borderRadius: "50% 50% 45% 45% / 60% 60% 40% 40%",
            borderColor: "#1b2b10",
            background:
              "radial-gradient(circle at 45% 40%, #e8f5e9 0%, #a5d6a7 45%, #388e3c 100%)",
          }}
        >
          <CharacterLimbs color="#1b2b10" />
          <div className="absolute top-[8%] right-[20%] w-8 h-16 bg-white/30 rounded-[50%] rotate-[20deg] blur-md pointer-events-none"></div>
          <div
            className="relative w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-[10px_10px_20px_rgba(0,0,0,0.4),inset_-10px_-10px_20px_rgba(0,0,0,0.5),inset_15px_15px_20px_rgba(255,255,255,0.15)]"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #8d6e63 0%, #4e342e 50%, #2b1d1d 100%)",
            }}
          >
            <div className="absolute top-2 left-6 w-8 h-4 bg-white/20 rounded-full rotate-[-20deg] blur-[1px]"></div>
            <div className="flex gap-3 -mt-3">
              <Eye
                mouseX={mousePos.x}
                mouseY={mousePos.y}
                eyeSize={32}
                pupilSize={16}
              />
              <Eye
                mouseX={mousePos.x}
                mouseY={mousePos.y}
                eyeSize={32}
                pupilSize={16}
              />
            </div>
            <div className="mt-3 w-5 h-2.5 border-b-4 border-[#1a0f0a] rounded-b-full opacity-80" />
          </div>
        </div>
        <CharacterShadow />
      </div>
    </CharacterWrapper>
  );
}

function RealisticOrange({ mousePos }: { mousePos: { x: number; y: number } }) {
  return (
    <CharacterWrapper delay={0.6}>
      <div className="relative flex flex-col items-center z-10">
        <div
          className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-[inset_-12px_-12px_24px_rgba(0,0,0,0.4),inset_12px_12px_24px_rgba(255,255,255,0.3),0_15px_20px_rgba(0,0,0,0.2)]"
          style={{
            background:
              "radial-gradient(circle at 35% 25%, #ffb74d 0%, #f57c00 50%, #e65100 100%)",
          }}
        >
          <CharacterLimbs color="#b23c00" />
          {/* Peel Texture */}
          <div
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(#bf360c 1.5px, transparent 1.5px)",
              backgroundSize: "6px 6px",
            }}
          ></div>
          <div className="absolute top-[12%] left-[18%] w-8 h-8 bg-white/30 rounded-full blur-md"></div>
          <div className="absolute -top-3 w-4 h-4 bg-[#1b5e20] rounded-full shadow-md" />
          <div className="absolute -top-5 right-6 w-10 h-6 bg-gradient-to-br from-[#81c784] to-[#2e7d32] rounded-[0_100%_0_100%] rotate-[20deg] shadow-md border border-black/10" />

          <div className="flex gap-4 mt-2">
            <Eye
              mouseX={mousePos.x}
              mouseY={mousePos.y}
              eyeSize={32}
              pupilSize={16}
            />
            <Eye
              mouseX={mousePos.x}
              mouseY={mousePos.y}
              eyeSize={32}
              pupilSize={16}
            />
          </div>
          <div className="mt-2 w-4 h-3 bg-orange-950 rounded-b-full opacity-70" />
        </div>
        <CharacterShadow />
      </div>
    </CharacterWrapper>
  );
}

function RealisticChickenLeg({
  mousePos,
}: {
  mousePos: { x: number; y: number };
}) {
  return (
    <CharacterWrapper delay={1.1}>
      <div className="relative flex flex-col items-center z-10">
        <div className="absolute -top-6 w-10 h-20 bg-gradient-to-r from-[#ffe0b2] via-[#ffcc80] to-[#f57c00] rounded-t-[30px] z-0 border border-[#ffb74d] shadow-[inset_0_-8px_15px_rgba(0,0,0,0.2)]" />
        <div className="absolute -top-8 left-[38%] w-8 h-8 bg-[#ffe0b2] rounded-full z-0 border border-[#ffb74d] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.6)]" />
        <div className="absolute -top-8 right-[38%] w-8 h-8 bg-[#ffcc80] rounded-full z-0 border border-[#ffb74d] shadow-[inset_-2px_2px_5px_rgba(0,0,0,0.2)]" />

        <div
          className="relative w-36 h-36 rounded-[50%_50%_40%_40%/65%_65%_35%_35%] mt-4 flex flex-col items-center justify-center pt-4 z-10 shadow-[inset_-12px_-12px_25px_rgba(0,0,0,0.5),inset_12px_12px_20px_rgba(255,255,255,0.15),0_15px_20px_rgba(0,0,0,0.2)]"
          style={{
            background:
              "radial-gradient(circle at 35% 25%, #f4511e 0%, #d84315 50%, #4e342e 100%)",
          }}
        >
          <CharacterLimbs color="#4e342e" />
          <div className="absolute top-[12%] left-[12%] w-8 h-10 bg-white/20 rounded-full rotate-[-25deg] blur-md shadow-inner"></div>
          <div className="flex gap-4">
            <Eye
              mouseX={mousePos.x}
              mouseY={mousePos.y}
              eyeSize={32}
              pupilSize={16}
            />
            <Eye
              mouseX={mousePos.x}
              mouseY={mousePos.y}
              eyeSize={32}
              pupilSize={16}
            />
          </div>
          <div className="mt-4 w-8 h-2.5 border-b-4 border-[#3a0000] rounded-b-full opacity-85" />
        </div>
        <CharacterShadow />
      </div>
    </CharacterWrapper>
  );
}

// Environment Details
function RealisticTree({
  style,
  isNight,
}: {
  style: React.CSSProperties;
  isNight: boolean;
}) {
  return (
    <div
      className="absolute sway-item flex flex-col flex-col-reverse items-center z-20"
      style={style}
    >
      {/* Trunk */}
      <div
        className={`w-4 h-24 sm:h-32 shadow-[inset_-2px_0_5px_rgba(0,0,0,0.5)] z-10 ${isNight ? "bg-[#3e2723]" : "bg-[#795548]"} rounded-sm`}
        style={{
          background: isNight
            ? "linear-gradient(to right, #3e2723, #1b0000)"
            : "linear-gradient(to right, #8d6e63, #4e342e)",
        }}
      ></div>
      {/* Leaves Array */}
      <div className="relative -mb-16 z-20 w-32 h-32 flex items-center justify-center">
        <div
          className={`absolute w-32 h-32 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.4),0_10px_15px_rgba(0,0,0,0.3)] ${isNight ? "bg-[#1b5e20]" : "bg-[#43a047]"} opacity-95`}
          style={{
            background: isNight
              ? "radial-gradient(circle at 30% 30%, #2e7d32, #1b5e20, #003300)"
              : "radial-gradient(circle at 30% 30%, #66bb6a, #43a047, #1b5e20)",
          }}
        ></div>
        <div
          className={`absolute w-28 h-28 -top-8 -left-4 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.3)] ${isNight ? "bg-[#003300]" : "bg-[#2e7d32]"}`}
        ></div>
        <div
          className={`absolute w-24 h-24 -top-6 -right-4 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.3)] ${isNight ? "bg-[#2e7d32]" : "bg-[#66bb6a]"}`}
        ></div>
      </div>
    </div>
  );
}

function GroundFlower({
  left,
  bottom,
  scale,
  color,
  delay,
}: {
  left: string;
  bottom: string;
  scale: number;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute flex flex-col items-center z-30 opacity-90"
      style={{ left, bottom, transform: `scale(${scale})` }}
      animate={{ rotate: [-5, 5] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "reverse",
        delay,
      }}
    >
      <div
        className={`w-5 h-5 ${color} rounded-full absolute -top-2 -left-2 shadow-sm`}
      ></div>
      <div
        className={`w-5 h-5 ${color} rounded-full absolute -top-2 -right-2 shadow-sm`}
      ></div>
      <div
        className={`w-5 h-5 ${color} rounded-full absolute -bottom-2 -left-2 shadow-sm`}
      ></div>
      <div
        className={`w-5 h-5 ${color} rounded-full absolute -bottom-2 -right-2 shadow-sm`}
      ></div>
      <div className="w-4 h-4 bg-yellow-400 rounded-full z-10 shadow-inner"></div>
      <div className="w-1.5 h-6 bg-green-600 rounded-b-md -mb-4 z-0"></div>
    </motion.div>
  );
}

function AnimatedBird({
  delay = 0,
  top = "20%",
  duration = 15,
  scale = 1,
  isNight = false,
}: {
  delay?: number;
  top?: string;
  duration?: number;
  scale?: number;
  isNight?: boolean;
}) {
  return (
    <motion.div
      initial={{ left: "-10%" }}
      animate={{ left: ["-10%", "110%"], y: [0, -20, 0, 20, 0] }}
      transition={{
        left: { duration, repeat: Infinity, delay, ease: "linear" },
        y: {
          duration: duration / 2,
          repeat: Infinity,
          delay,
          ease: "easeInOut",
        },
      }}
      className="absolute z-10"
      style={{ top, transform: `scale(${scale})` }}
    >
      <motion.div
        animate={{ scaleY: [1, -0.4, 1], y: [0, 2, 0] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="30"
          height="15"
          viewBox="0 0 30 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isNight ? "text-white/30" : "text-black/30"}
        >
          <path
            d="M2 12 Q 8 2, 15 10 Q 22 2, 28 12"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function RealisticHouse({
  style,
  isNight,
}: {
  style?: React.CSSProperties;
  isNight: boolean;
}) {
  return (
    <div className="absolute z-10 flex flex-col items-center" style={style}>
      {/* Chimney */}
      <div
        className={`absolute top-4 left-10 w-6 h-16 ${isNight ? "bg-[#2b1910]" : "bg-[#5d4037]"} z-10`}
      >
        <div
          className={`absolute -top-1 -left-1 w-8 h-2 ${isNight ? "bg-[#1a0f0a]" : "bg-[#4e342e]"}`}
        />
        <motion.div
          animate={{
            y: [-10, -25],
            x: [0, 8, -5],
            opacity: [0, 0.4, 0],
            scale: [1, 1.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
          className="absolute -top-6 left-0 w-6 h-6 bg-slate-300/40 rounded-full blur-md"
        />
        <motion.div
          animate={{
            y: [-15, -35],
            x: [0, -8, 5],
            opacity: [0, 0.3, 0],
            scale: [1, 1.8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 1,
            ease: "easeOut",
          }}
          className="absolute -top-10 left-0 w-8 h-8 bg-slate-200/30 rounded-full blur-md"
        />
      </div>

      {/* Roof */}
      <div className="relative z-20 w-48 h-24 flex justify-center drop-shadow-lg">
        <div
          className={`absolute bottom-0 w-full h-full ${isNight ? "bg-[#7f0000]" : "bg-[#c62828]"}`}
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.3) 8px, rgba(0,0,0,0.3) 16px)",
            }}
          />
        </div>
        <div
          className={`absolute bottom-0 w-[105%] h-2 ${isNight ? "bg-[#4a0000]" : "bg-[#b71c1c]"} rounded-full`}
        />
      </div>

      {/* Main Building */}
      <div
        className={`relative z-10 w-40 h-28 ${isNight ? "bg-[#ffd54f]/90" : "bg-[#fff8e1]"} rounded-b-sm shadow-[inset_0_-8px_15px_rgba(0,0,0,0.1)] border-b-4 border-black/10 flex items-end justify-center pb-0`}
      >
        {/* Texture */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 10px, #000 10px, #000 12px)",
          }}
        />

        {/* Door */}
        <div
          className={`absolute bottom-0 w-12 h-16 border-2 border-[#5d4037] border-b-0 rounded-t-md flex items-center justify-center p-1 ${isNight ? "bg-[#3e2723]" : "bg-[#795548]"}`}
        >
          <div
            className={`w-full h-full border border-black/30 rounded-sm ${isNight ? "bg-[#4e342e]" : "bg-[#8d6e63]"}`}
          />
          <div className="absolute right-2 top-1/2 w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-sm" />
        </div>

        {/* Windows */}
        <div
          className={`absolute bottom-8 left-3 w-8 h-10 border-2 border-[#795548] rounded-t-full flex flex-col items-center overflow-hidden ${isNight ? "bg-orange-300 shadow-[0_0_15px_rgba(255,165,0,0.5)]" : "bg-blue-100"}`}
        >
          <div className="w-full h-1/2 border-b-2 border-[#795548]" />
          <div className="absolute h-full w-0.5 bg-[#795548]" />
          {isNight && (
            <div className="absolute inset-0 bg-yellow-400/20 animate-pulse" />
          )}
        </div>

        <div
          className={`absolute bottom-8 right-3 w-8 h-10 border-2 border-[#795548] rounded-t-full flex flex-col items-center overflow-hidden ${isNight ? "bg-orange-300 shadow-[0_0_15px_rgba(255,165,0,0.5)]" : "bg-blue-100"}`}
        >
          <div className="w-full h-1/2 border-b-2 border-[#795548]" />
          <div className="absolute h-full w-0.5 bg-[#795548]" />
          {isNight && (
            <div className="absolute inset-0 bg-yellow-400/20 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}

function GroundedRealisticFarmEnvironment({ isLogin }: { isLogin: boolean }) {
  const isNight = !isLogin;

  const stars = useMemo(() => {
    return [...Array(25)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 50}%`,
      width: Math.random() > 0.5 ? 2 : 3,
      height: Math.random() > 0.5 ? 2 : 3,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 4,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] z-0">
      <style>{customStyles}</style>

      {/* Sky Background */}
      <motion.div
        animate={{ backgroundColor: isNight ? "#0f172a" : "#7dd3fc" }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      />

      {/* Sky Gradients */}
      <div
        className={`absolute inset-0 transition-opacity duration-1500 ${isNight ? "opacity-100" : "opacity-0"}`}
        style={{
          background:
            "radial-gradient(ellipse at bottom, #1e1b4b 0%, transparent 80%)",
        }}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-1500 ${isNight ? "opacity-0" : "opacity-100"}`}
        style={{
          background:
            "linear-gradient(to bottom, #38bdf8 0%, #e0f2fe 60%, #fffbeb 100%)",
        }}
      />

      {/* Sun / Moon */}
      <motion.div
        initial={false}
        animate={{
          y: isNight ? 20 : 60,
          x: isNight ? 60 : -60,
          scale: isNight ? 0.9 : 1.1,
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className={`absolute top-10 sm:top-16 left-1/2 md:left-[15%] lg:left-[20%] -ml-12 sm:-ml-16 md:ml-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full transition-colors duration-1500 ${isNight ? "bg-indigo-50 shadow-[0_0_80px_rgba(224,231,255,0.7)] border-2 border-indigo-100" : "bg-gradient-to-br from-yellow-100 to-amber-400 shadow-[0_0_100px_rgba(253,224,71,0.9)]"}`}
      >
        {isNight && (
          <div className="absolute top-4 right-6 w-12 h-12 bg-indigo-900/40 rounded-full blur-[2px]" />
        )}
      </motion.div>

      {/* Stars */}
      <AnimatePresence>
        {isNight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            {stars.map((star) => (
              <motion.div
                key={star.id}
                animate={{ opacity: [0.1, 0.8, 0.1] }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  delay: star.delay,
                }}
                className="absolute bg-white rounded-full"
                style={{
                  left: star.left,
                  top: star.top,
                  width: star.width,
                  height: star.height,
                  boxShadow: "0 0 5px rgba(255,255,255,0.8)",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Birds */}
      <AnimatedBird
        delay={0}
        top="15%"
        duration={20}
        scale={1}
        isNight={isNight}
      />
      <AnimatedBird
        delay={5}
        top="25%"
        duration={25}
        scale={0.7}
        isNight={isNight}
      />
      <AnimatedBird
        delay={12}
        top="10%"
        duration={22}
        scale={1.2}
        isNight={isNight}
      />

      {/* Background Layers - Giving Realistic Depth using solid Divs with absolute bottoms */}

      {/* Far Mountains */}
      <motion.div
        animate={{ backgroundColor: isNight ? "#1e293b" : "#93c5fd" }}
        transition={{ duration: 1.5 }}
        className="absolute bottom-[25%] left-[-10%] w-[120%] h-[50%] rounded-[100%_100%_0_0] blur-[1px] opacity-80"
      />
      <motion.div
        animate={{ backgroundColor: isNight ? "#0f172a" : "#60a5fa" }}
        transition={{ duration: 1.5 }}
        className="absolute bottom-[20%] left-[20%] w-[100%] h-[40%] rounded-[100%_100%_0_0] blur-[1px] opacity-70"
      />

      {/* Mid Grassy Hills */}
      <motion.div
        animate={{ backgroundColor: isNight ? "#064e3b" : "#4ade80" }}
        transition={{ duration: 1.5 }}
        className="absolute bottom-[10%] left-[-20%] w-[140%] h-[40%] rounded-[60%_60%_0_0] shadow-[inset_0_-20px_30px_rgba(0,0,0,0.1),0_-10px_20px_rgba(0,0,0,0.05)] border-t border-white/10"
      />
      <motion.div
        animate={{ backgroundColor: isNight ? "#022c22" : "#22c55e" }}
        transition={{ duration: 1.5 }}
        className="absolute bottom-[5%] left-[10%] w-[120%] h-[35%] rounded-[70%_50%_0_0] shadow-[inset_0_-20px_30px_rgba(0,0,0,0.1),0_-10px_20px_rgba(0,0,0,0.05)] border-t border-white/10"
      />

      {/* Planted Trees and House on Mid Hills */}
      <RealisticTree
        style={{ left: "12%", bottom: "28%", transform: "scale(0.6)" }}
        isNight={isNight}
      />
      <RealisticTree
        style={{ left: "25%", bottom: "22%", transform: "scale(0.85)" }}
        isNight={isNight}
      />
      <RealisticHouse
        style={{ right: "12%", bottom: "18%", transform: "scale(1.2)" }}
        isNight={isNight}
      />
      <RealisticTree
        style={{ right: "32%", bottom: "16%", transform: "scale(1.1)" }}
        isNight={isNight}
      />
      <RealisticTree
        style={{ right: "-2%", bottom: "12%", transform: "scale(0.9)" }}
        isNight={isNight}
      />

      {/* Foreground Realistic Grassy Plain */}
      <motion.div
        animate={{
          background: isNight
            ? "linear-gradient(to bottom, #064e3b 0%, #0f172a 100%)"
            : "linear-gradient(to bottom, #86efac 0%, #15803d 100%)",
        }}
        transition={{ duration: 1.5 }}
        className="absolute bottom-0 left-[-5%] w-[110%] h-[20%] sm:h-[25%] rounded-[40%_40%_0_0] shadow-[0_-20px_40px_rgba(0,0,0,0.2)] border-t-2 border-green-300/30 grass-pattern z-20"
      />

      {/* Ground Details (Fence & Flowers) on Foreground */}
      <div className="absolute bottom-[10%] left-0 w-full z-20 flex px-8 opacity-80">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`w-3 sm:w-4 h-20 sm:h-28 rounded-t-sm mx-auto shadow-md ${isNight ? "bg-amber-950" : "bg-amber-700"}`}
            style={{ transform: "rotate(-2deg)" }}
          >
            {/* Wood texture lines */}
            <div className="w-px h-full bg-black/20 ml-1"></div>
          </div>
        ))}
        {/* Rails */}
        <div
          className={`absolute bottom-8 left-0 w-full h-2.5 sm:h-3.5 shadow-md ${isNight ? "bg-amber-900/90" : "bg-amber-600/90"}`}
        />
        <div
          className={`absolute bottom-16 left-0 w-full h-2.5 sm:h-3.5 shadow-md ${isNight ? "bg-amber-900/90" : "bg-amber-600/90"}`}
        />
      </div>

      {/* Vibrant Flowers Sprouting from Foreground */}
      <GroundFlower
        left="15%"
        bottom="5%"
        scale={0.8}
        color={isNight ? "bg-pink-900" : "bg-pink-400"}
        delay={0}
      />
      <GroundFlower
        left="25%"
        bottom="12%"
        scale={1.2}
        color={isNight ? "bg-purple-900" : "bg-purple-400"}
        delay={0.5}
      />
      <GroundFlower
        left="45%"
        bottom="8%"
        scale={0.9}
        color={isNight ? "bg-blue-900" : "bg-blue-400"}
        delay={1.2}
      />
      <GroundFlower
        left="75%"
        bottom="15%"
        scale={1.1}
        color={isNight ? "bg-red-900" : "bg-red-400"}
        delay={0.2}
      />
      <GroundFlower
        left="85%"
        bottom="6%"
        scale={0.7}
        color={isNight ? "bg-orange-900" : "bg-orange-400"}
        delay={1.5}
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isLogin = variant === "login";

  useEffect(() => {
    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      animationFrameId = requestAnimationFrame(() =>
        setMousePos({ x: e.clientX, y: e.clientY }),
      );
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden shadow-soft-xl ${fullScreen ? "w-full h-full rounded-none shadow-none" : "w-full h-full min-h-[800px] rounded-[1.5rem]"}`}
    >
      <GroundedRealisticFarmEnvironment isLogin={isLogin} />

      {/* Children Content Layer (like the auth form) */}
      {children && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-auto">
          {children}
        </div>
      )}

      {/* Characters Group - Firmly attached to the grassy plain foreground via absolute positioning */}
      <div
        className={`absolute bottom-0 left-0 w-full h-[300px] pointer-events-none flex justify-center items-end pb-8 z-30`}
      >
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login-group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className={`relative h-full pointer-events-none ${fullScreen ? "w-full max-w-[1400px]" : "w-[500px]"}`}
            >
              {fullScreen ? (
                <>
                  <div className="hidden sm:block absolute left-[8%] md:left-[10%] bottom-[8%] z-20 scale-[0.65] md:scale-[0.75] pointer-events-auto hover:scale-[0.8] transition-transform">
                    <RealisticEggplant mousePos={mousePos} />
                  </div>
                  <div className="absolute left-[3%] sm:left-[18%] md:left-[21%] bottom-[-5%] z-30 scale-[0.75] md:scale-[0.85] pointer-events-auto hover:scale-[0.9] transition-transform">
                    <RealisticTomato mousePos={mousePos} />
                  </div>
                  <div className="hidden sm:block absolute right-[8%] md:right-[12%] bottom-[6%] z-20 scale-[0.65] md:scale-[0.75] pointer-events-auto hover:scale-[0.8] transition-transform">
                    <RealisticSteak mousePos={mousePos} />
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute left-[5%] bottom-[2%] z-20 scale-[0.6] pointer-events-auto hover:scale-[0.65] transition-transform">
                    <RealisticEggplant mousePos={mousePos} />
                  </div>
                  <div className="absolute right-[5%] bottom-[5%] z-10 scale-[0.6] pointer-events-auto hover:scale-[0.65] transition-transform">
                    <RealisticSteak mousePos={mousePos} />
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[-8%] z-30 scale-[0.75] pointer-events-auto hover:scale-[0.8] transition-transform">
                    <RealisticTomato mousePos={mousePos} />
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="signup-group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className={`relative h-full pointer-events-none ${fullScreen ? "w-full max-w-[1400px]" : "w-[500px]"}`}
            >
              {fullScreen ? (
                <>
                  <div className="hidden sm:block absolute left-[2%] md:left-[6%] bottom-[5%] z-10 scale-[0.6] md:scale-[0.75] pointer-events-auto hover:scale-[0.8] transition-transform">
                    <RealisticApple mousePos={mousePos} />
                  </div>
                  <div className="hidden sm:block absolute left-[12%] md:left-[14%] bottom-[8%] z-20 scale-[0.65] md:scale-[0.8] pointer-events-auto hover:scale-[0.85] transition-transform">
                    <RealisticChickenLeg mousePos={mousePos} />
                  </div>
                  <div className="absolute left-[5%] sm:left-[20%] md:left-[23%] bottom-[-5%] z-30 scale-[0.8] md:scale-[0.9] pointer-events-auto hover:scale-[0.95] transition-transform">
                    <RealisticAvocado mousePos={mousePos} />
                  </div>
                  <div className="hidden sm:block absolute right-[10%] md:right-[14%] bottom-[8%] z-20 scale-[0.65] md:scale-[0.8] pointer-events-auto hover:scale-[0.85] transition-transform">
                    <RealisticOrange mousePos={mousePos} />
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute left-[2%] bottom-[6%] z-10 scale-[0.6] pointer-events-auto hover:scale-[0.65] transition-transform">
                    <RealisticChickenLeg mousePos={mousePos} />
                  </div>
                  <div className="absolute right-[12%] bottom-[8%] z-20 scale-[0.7] pointer-events-auto hover:scale-[0.75] transition-transform">
                    <RealisticOrange mousePos={mousePos} />
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[-8%] z-30 scale-[0.8] pointer-events-auto hover:scale-[0.85] transition-transform">
                    <RealisticAvocado mousePos={mousePos} />
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
