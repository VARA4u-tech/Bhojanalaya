import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Clock,
  UtensilsCrossed,
  Users,
  ArrowRight,
  Sparkles,
  Calendar,
  Bell,
  Leaf,
} from "lucide-react";
import { FloatingFoodHero } from "@/components/ui/hero-section-7";
import { PopularDishesShowcase } from "@/components/menu/PopularDishesShowcase";
import { useRestaurantStore } from "@/store";

const features = [
  {
    icon: Clock,
    title: "Real-Time Status",
    description:
      "Track your order from kitchen to table with live updates — no more wondering where your food is!",
    color: "bg-secondary/10 text-secondary",
    hoverColor: "group-hover:bg-secondary group-hover:text-white",
  },
  {
    icon: UtensilsCrossed,
    title: "Pre-Order Food",
    description:
      "Browse our fresh menu and order ahead for faster service. Your food will be hot and ready on arrival.",
    color: "bg-primary/10 text-primary",
    hoverColor: "group-hover:bg-primary group-hover:text-white",
  },
  {
    icon: Users,
    title: "No Waiting Lines",
    description:
      "Reserve tables in advance and skip the queue. More time enjoying, less time waiting.",
    color: "bg-accent/20 text-primary",
    hoverColor: "group-hover:bg-accent group-hover:text-primary",
  },
];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HomePage() {
  const { fetchRestaurants } = useRestaurantStore();

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return (
    <>
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <FloatingFoodHero
        title="Bhojanālaya's Best Flavors | Just a Click Away"
        description="From Babai Hotel's idlis to Southern Spice's biryanis, explore Vijayawada's finest dining. Better food for more people, delivered right to your soul."
        images={[
          {
            src: "/images/hero/burger.png",
            alt: "Burger",
            className:
              "w-24 sm:w-32 md:w-44 lg:w-52 top-[12%] left-[2%] md:left-[4%] lg:left-[7%]",
          },
          {
            src: "/images/hero/dumplings.png",
            alt: "Dumplings",
            className:
              "w-20 sm:w-28 md:w-38 lg:w-44 top-[14%] right-[2%] md:right-[4%] lg:right-[7%]",
          },
          {
            src: "/images/hero/pizza-slice.png",
            alt: "Pizza slice",
            className:
              "w-28 sm:w-36 md:w-48 lg:w-56 bottom-[8%] right-[4%] md:right-[6%] lg:right-[10%]",
          },
          {
            src: "/images/hero/basil-leaf.png",
            alt: "Basil leaf",
            className:
              "w-8 sm:w-10 md:w-14 lg:w-16 top-[42%] left-[10%] md:left-[14%]",
          },
          {
            src: "/images/hero/tomato-slice.png",
            alt: "Tomato slice",
            className:
              "w-8 sm:w-10 md:w-12 lg:w-14 top-[60%] right-[14%] md:right-[18%]",
          },
        ]}
      >
        <Link to="/menu" className="w-full sm:w-auto">
          <Button
            variant="hero"
            size="xl"
            className="w-full sm:w-auto min-w-[200px] bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
          >
            <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5" />
            View Menu
          </Button>
        </Link>
        <Link to="/booking" className="w-full sm:w-auto">
          <Button
            variant="hero-outline"
            size="xl"
            className="w-full sm:w-auto min-w-[200px] border-2 border-primary text-primary bg-primary/5 hover:bg-primary/10"
          >
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Book a Table
          </Button>
        </Link>
      </FloatingFoodHero>

      {/* ── Features Section ─────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 lg:py-20">
        <div className="container px-4">
          {/* Section header — poster "SEE YOU THERE!" style */}
          <motion.div
            className="text-center mb-8 sm:mb-10 lg:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="farmers-badge mb-4">
              <Leaf className="w-3 h-3" />
              <span>Fresh Experience</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl mb-3 text-foreground">
              Why Choose Bhojanālaya?
            </h2>
            <p className="font-serif italic text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
              We've reimagined the dining experience — saving you time & hassle
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-5 lg:gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="group organic-card p-5 sm:p-7 lg:p-8 hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon bubble */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${feature.color} ${feature.hoverColor}`}
                >
                  <feature.icon className="h-7 w-7 transition-colors duration-300" />
                </div>
                <h3 className="font-heading text-lg sm:text-xl mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative bottom dash — like the poster's divider lines */}
                <div className="mt-5 h-0.5 w-10 bg-primary/20 rounded-full group-hover:w-16 transition-all duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Popular Dishes Showcase ───────────────────────────────────────── */}
      <div className="relative">
        <PopularDishesShowcase />
        {/* Corner blobs */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-secondary/8 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />
      </div>

      {/* ── CTA Section — "See You There!" style ─────────────────────────── */}
      <section className="py-10 sm:py-14 lg:py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] market-cta p-7 sm:p-10 lg:p-16 text-center"
          >
            {/* Inner organic border (matches the poster's double border) */}
            <div className="absolute inset-3 sm:inset-4 rounded-[1.75rem] border border-primary-foreground/15 pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-5 rounded-full bg-primary-foreground/15 text-primary-foreground text-xs sm:text-sm font-bold uppercase tracking-widest">
                <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Get notified when your order is ready</span>
              </div>

              {/* Poster-style large bold heading */}
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-5xl mb-2 text-primary-foreground">
                Ready to Skip the Queue?
              </h2>
              <p className="font-heading text-xl sm:text-2xl lg:text-3xl mb-5 text-primary-foreground/80">
                See You There!
              </p>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
                <div className="h-px w-12 bg-primary-foreground/30 rounded-full" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground/50" />
                <div className="h-px w-12 bg-primary-foreground/30 rounded-full" />
              </div>

              <p className="font-sans text-sm sm:text-base text-primary-foreground/75 mb-7 sm:mb-9 max-w-lg mx-auto leading-relaxed">
                Book your table now and enjoy a seamless dining experience with
                real-time updates
              </p>

              <Link to="/booking" className="inline-block w-full sm:w-auto">
                <Button
                  size="xl"
                  className="w-full sm:w-auto bg-card text-foreground hover:bg-card/90 shadow-lg font-heading tracking-wide"
                >
                  Book Your Table Now
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Decorative glows */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary-foreground/8 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-primary-foreground/8 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </section>
    </>
  );
}
