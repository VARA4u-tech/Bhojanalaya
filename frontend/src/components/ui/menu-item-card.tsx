import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Clock, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// --- PROPS INTERFACE ---
interface MenuItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  isVegetarian: boolean;
  name: string;
  price: number;
  originalPrice: number;
  quantity: string;
  prepTimeInMinutes: number;
  dietaryTags?: string[];
  chefStory?: { title: string; text: string };
  onAdd: () => void;
}

const MenuItemCard = React.forwardRef<HTMLDivElement, MenuItemCardProps>(
  (
    {
      className,
      imageUrl,
      isVegetarian,
      name,
      price,
      originalPrice,
      quantity,
      prepTimeInMinutes,
      dietaryTags = [],
      chefStory,
      onAdd,
      ...props
    },
    ref,
  ) => {
    const savings = originalPrice - price;

    // --- ANIMATION VARIANTS ---
    const cardVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      hover: { scale: 1.03, transition: { duration: 0.2 } },
    };

    const buttonVariants = {
      tap: { scale: 0.95 },
    };

    const vegIconVariants = {
      initial: { scale: 0 },
      animate: {
        scale: 1,
        transition: { delay: 0.3, type: "spring" as const, stiffness: 200 },
      },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative flex flex-col w-full max-w-sm overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm group h-full",
          className,
        )}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        layout
        {...(props as any)}
      >
        {/* --- IMAGE & ADD BUTTON CONTAINER --- */}
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-48 transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* --- VEGETARIAN ICON --- */}
          <motion.div
            className="absolute top-3 right-3"
            variants={vegIconVariants}
            aria-label={isVegetarian ? "Vegetarian" : "Non-Vegetarian"}
          >
            <div
              className={cn(
                "w-5 h-5 border flex items-center justify-center rounded-md backdrop-blur-sm",
                isVegetarian
                  ? "border-green-600 bg-white/90"
                  : "border-red-600 bg-white/90",
              )}
            >
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  isVegetarian ? "bg-green-600" : "bg-red-600",
                )}
              />
            </div>
          </motion.div>

          {/* --- DIETARY TAGS BADGES --- */}
          {dietaryTags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
              {dietaryTags.slice(0, 2).map((tag, idx) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md backdrop-blur-md border border-white/20 bg-black/40 text-white shadow-sm flex items-center gap-1"
                >
                  {tag}
                </motion.div>
              ))}
            </div>
          )}

          {/* --- CHEF'S STORY TRIGGER --- */}
          {chefStory && (
            <div className="absolute top-3 left-16 sm:left-14 z-10">
              <Dialog>
                <DialogTrigger asChild>
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-7 w-7 rounded-full bg-secondary text-secondary-foreground shadow-lg flex items-center justify-center border border-white/30 backdrop-blur-md"
                    aria-label="Read Chef's Story"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </motion.button>
                </DialogTrigger>
                <DialogContent
                  onClick={(e) => e.stopPropagation()}
                  className="sm:max-w-md p-6 bg-card border-primary/20 rounded-[2rem]"
                >
                  <DialogHeader>
                    <div className="flex justify-center mb-4 text-secondary">
                      <Sparkles className="w-8 h-8 opacity-80" />
                    </div>
                    <DialogTitle className="font-heading text-2xl text-center text-primary mb-2">
                      {chefStory.title}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="font-serif italic text-muted-foreground text-center leading-relaxed text-base px-2">
                    "{chefStory.text}"
                  </div>
                  <div className="flex justify-center mt-6">
                    <div className="h-px w-16 bg-primary/20 rounded-full" />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* --- ADD BUTTON --- */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full flex justify-center">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              variants={buttonVariants}
              whileTap="tap"
              className="px-8 py-2 text-sm font-bold uppercase transition-all duration-300 transform border rounded-lg shadow-lg bg-background/80 text-foreground backdrop-blur-sm border-border/50 md:translate-y-4 md:opacity-0 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Add ${name} to cart`}
            >
              Add
            </motion.button>
          </div>
        </div>

        {/* --- CONTENT SECTION --- */}
        <div className="flex flex-col flex-grow p-4 text-left">
          {/* --- PRICING --- */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">₹{price}</span>
            <span className="text-sm line-through text-muted-foreground">
              ₹{originalPrice}
            </span>
            {savings > 0 && (
              <span className="text-sm font-semibold text-green-500">
                SAVE ₹{savings}
              </span>
            )}
          </div>

          {/* --- QUANTITY --- */}
          <p className="mt-1 text-sm text-muted-foreground">{quantity}</p>

          {/* --- ITEM NAME --- */}
          <h3 className="mt-2 text-base font-semibold leading-tight text-foreground line-clamp-2">
            {name}
          </h3>

          {/* --- PREP TIME --- */}
          <div className="flex items-center gap-1.5 mt-auto pt-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{prepTimeInMinutes} mins</span>
          </div>
        </div>
      </motion.div>
    );
  },
);

MenuItemCard.displayName = "MenuItemCard";

export { MenuItemCard };
