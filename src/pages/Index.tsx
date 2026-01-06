import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Clock, UtensilsCrossed, Users, ArrowRight, Sparkles, Calendar, Bell } from "lucide-react";
import { FloatingFoodHero } from "@/components/ui/hero-section-7";
import { MenuItemCard } from "@/components/ui/menu-item-card";
import { PopularDishesShowcase } from "@/components/menu/PopularDishesShowcase";

const features = [
  {
    icon: Clock,
    title: "Real-Time Status",
    description: "Track your order from kitchen to table with live updates",
  },
  {
    icon: UtensilsCrossed,
    title: "Pre-Order Food",
    description: "Browse the menu and order ahead for faster service",
  },
  {
    icon: Users,
    title: "No Waiting Lines",
    description: "Reserve tables in advance and skip the queue",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <FloatingFoodHero
        title="Bhojanālaya's Best Flavors | Just a Click Away"
        description="From Babai Hotel's idlis to Southern Spice's biryanis, explore Vijayawada's finest dining. Better food for more people, delivered right to your soul."
        images={[
          {
            src: '/images/hero/burger.png',
            alt: 'Burger',
            className: 'w-32 sm:w-44 md:w-60 lg:w-72 top-[8%] left-[2%] md:left-[5%]',
          },
          {
            src: '/images/hero/dumplings.png',
            alt: 'Dumplings',
            className: 'w-28 sm:w-36 md:w-52 lg:w-60 top-[12%] right-[2%] md:right-[8%]',
          },
          {
            src: '/images/hero/pizza-slice.png',
            alt: 'Pizza slice',
            className: 'w-40 sm:w-52 md:w-68 lg:w-80 bottom-[8%] right-[5%] md:right-[10%]',
          },
          {
            src: '/images/hero/basil-leaf.png',
            alt: 'Basil leaf',
            className: 'w-10 sm:w-14 md:w-20 top-[35%] left-[15%]',
          },
          {
            src: '/images/hero/tomato-slice.png',
            alt: 'Tomato slice',
            className: 'w-10 sm:w-12 md:w-16 top-[55%] right-[20%]',
          },
        ]}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/menu">
            <Button variant="hero" size="xl" className="min-w-[200px]">
              <UtensilsCrossed className="h-5 w-5" />
              View Menu
            </Button>
          </Link>
          <Link to="/booking">
            <Button variant="hero-outline" size="xl" className="min-w-[200px]">
              <Calendar className="h-5 w-5" />
              Book a Table
            </Button>
          </Link>
        </div>
      </FloatingFoodHero>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-heading text-xl sm:text-h2 lg:text-3xl mb-3 sm:mb-4">Why Choose Bhojanālaya?</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-4">
              We've reimagined the dining experience to save you time and hassle
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 lg:gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                className="group p-4 sm:p-6 lg:p-8 bg-card rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-heading text-h3 mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Dishes Showcase Section */}
      <div className="relative">
        <PopularDishesShowcase />
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl" />
      </div>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container px-4">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-6 sm:p-8 lg:p-16 text-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-medium">
                <Bell className="h-4 w-4" />
                <span>Get notified when your order is ready</span>
              </div>
              <h2 className="font-heading text-h2 lg:text-4xl mb-4 text-primary-foreground">
                Ready to Skip the Queue?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Book your table now and enjoy a seamless dining experience with real-time updates
              </p>
              <Link to="/booking">
                <Button
                  variant="secondary"
                  size="xl"
                  className="bg-card text-foreground hover:bg-card/90"
                >
                  Book Your Table Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>
    </>
  );
}
