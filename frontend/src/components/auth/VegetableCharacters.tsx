import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

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
    if (!eyeRef.current) return;
    const rect = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    const dx = mouseX - eyeCenterX;
    const dy = mouseY - eyeCenterY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.hypot(dx, dy);

    const maxOffset = (eyeSize - pupilSize) / 2 - 2; // -2 for padding
    const distanceFactor = Math.min(distance / 200, 1);

    setOffset({
      x: Math.cos(angle) * maxOffset * distanceFactor,
      y: Math.sin(angle) * maxOffset * distanceFactor,
    });
  }, [mouseX, mouseY, eyeSize, pupilSize]);

  // Random blink
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
      className="bg-white rounded-full relative overflow-hidden shadow-inner flex items-center justify-center"
      style={{ width: eyeSize, height: eyeSize }}
    >
      <div
        className={`w-full h-full bg-[#1a1a2e] absolute z-10 origin-top transition-transform duration-100 ${isBlinking ? "scale-y-100" : "scale-y-0"}`}
      />
      <div
        className="bg-[#1a1a2e] rounded-full absolute"
        style={{
          width: pupilSize,
          height: pupilSize,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        <div className="absolute top-[15%] left-[15%] w-[30%] h-[30%] bg-white rounded-full opacity-80" />
      </div>
    </div>
  );
}

export function VegetableHero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame for smooth performance
      requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center bg-gradient-to-br from-green-300 via-emerald-200 to-amber-200 rounded-3xl overflow-hidden p-8">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/30 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-sm aspect-square flex items-center justify-center">
        {/* Tomato Character */}
        <motion.div
          initial={{ y: 20, rotate: -5 }}
          animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[5%] bottom-[10%] z-20"
        >
          <div className="relative w-40 h-36 bg-gradient-to-br from-red-400 to-red-600 rounded-[45%] shadow-xl flex flex-col items-center justify-center border-4 border-red-700/20">
            {/* Tomato leaf */}
            <div className="absolute -top-8 w-16 h-12">
              <svg
                viewBox="0 0 100 100"
                className="fill-green-500 drop-shadow-md"
              >
                <path d="M50 80 C20 80, 0 50, 20 20 C40 20, 45 40, 50 60 C55 40, 60 20, 80 20 C100 50, 80 80, 50 80 Z" />
                <path d="M45 60 Q50 20 55 0 L45 0 Z" />
              </svg>
            </div>
            {/* Eyes */}
            <div className="flex gap-4 mt-2">
              <Eye
                mouseX={mousePos.x}
                mouseY={mousePos.y}
                eyeSize={40}
                pupilSize={20}
              />
              <Eye
                mouseX={mousePos.x}
                mouseY={mousePos.y}
                eyeSize={40}
                pupilSize={20}
              />
            </div>
            {/* Mouth */}
            <div className="mt-3 w-8 h-4 border-b-4 border-[#1a1a2e] rounded-b-full opacity-60" />
          </div>
        </motion.div>

        {/* Carrot Character */}
        <motion.div
          initial={{ y: -20, rotate: 10 }}
          animate={{ y: [5, -5, 5], rotate: [12, 8, 12] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute left-[5%] bottom-[5%] z-30"
        >
          <div className="relative w-24 h-56 bg-gradient-to-br from-orange-400 to-orange-600 rounded-t-full rounded-b-[40%] shadow-xl flex flex-col items-center justify-start pt-16 border-4 border-orange-700/20 transform -rotate-12">
            {/* Carrot leaf */}
            <div className="absolute -top-12 w-20 h-16">
              <svg
                viewBox="0 0 100 100"
                className="fill-green-500 drop-shadow-md"
              >
                <path d="M50 80 Q20 40 10 10 Q40 30 50 70 Q60 30 90 10 Q80 40 50 80 Z" />
              </svg>
            </div>
            {/* Eyes */}
            <div className="flex gap-2">
              <Eye
                mouseX={mousePos.x}
                mouseY={mousePos.y}
                eyeSize={28}
                pupilSize={14}
              />
              <Eye
                mouseX={mousePos.x}
                mouseY={mousePos.y}
                eyeSize={28}
                pupilSize={14}
              />
            </div>
            {/* Mouth */}
            <div className="mt-3 w-4 h-4 bg-[#1a1a2e] rounded-full opacity-60" />
          </div>
        </motion.div>

        {/* Broccoli Character - Positioned higher */}
        <motion.div
          initial={{ y: 0, rotate: -5 }}
          animate={{ y: [-8, 8, -8] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-[5%] left-[20%] z-10"
        >
          <div className="relative w-48 h-48 flex flex-col items-center">
            {/* Broccoli head */}
            <div className="absolute top-0 w-full h-32 bg-gradient-to-br from-green-500 to-emerald-700 rounded-t-[50px] shadow-xl flex flex-col items-center justify-center border-4 border-emerald-900/20 z-20">
              {/* Fluffy parts */}
              <div className="absolute -left-4 top-2 w-20 h-20 bg-green-500 rounded-full" />
              <div className="absolute -right-4 top-2 w-20 h-20 bg-green-600 rounded-full" />
              <div className="absolute -top-8 left-10 w-28 h-28 bg-emerald-500 rounded-full" />

              {/* Face */}
              <div className="relative z-30 flex gap-5 mt-8">
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
              <div className="relative z-30 mt-2 w-6 h-3 border-b-4 border-emerald-900 rounded-b-full opacity-60" />
            </div>
            {/* Broccoli Stem */}
            <div className="absolute bottom-0 w-16 h-24 bg-gradient-to-b from-green-300 to-green-500 rounded-b-xl border-x-4 border-b-4 border-emerald-900/20 z-10" />
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-8 right-8 text-center bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/50 text-emerald-950">
        <h3 className="font-heading font-bold text-lg">Fresh Ingredients!</h3>
        <p className="text-sm opacity-80">
          We use only the freshest characters... err, ingredients for your
          meals.
        </p>
      </div>
    </div>
  );
}
