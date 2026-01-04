import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Clock, UtensilsCrossed, Users, ArrowRight, Sparkles, Calendar, Bell } from "lucide-react";
import { FloatingFoodHero } from "@/components/ui/hero-section-7";
import { MenuItemCard } from "@/components/ui/menu-item-card";
import { popularItems } from "@/data/popular-items";

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
        title="Bhojanalaya's Best Flavors, Just a Click Away."
        description="From Babai Hotel's idlis to Southern Spice's biryanis, explore Vijayawada's finest dining. Better food for more people, delivered right to your soul."
        images={[
          {
            src: '/images/hero/burger.png',
            alt: 'Burger',
            className: 'w-40 sm:w-56 md:w-64 top-[10%] left-[5%] md:left-[10%]',
          },
          {
            src: '/images/hero/dumplings.png',
            alt: 'Dumplings',
            className: 'w-32 sm:w-48 md:w-56 top-[15%] right-[5%] md:right-[12%]',
          },
          {
            src: '/images/hero/pizza-slice.png',
            alt: 'Pizza slice',
            className: 'w-48 sm:w-64 md:w-72 bottom-[10%] right-[8%] md:right-[15%]',
          },
          {
            src: '/images/hero/basil-leaf.png',
            alt: 'Basil leaf',
            className: 'w-12 md:w-16 top-[40%] left-[20%]',
          },
          {
            src: '/images/hero/tomato-slice.png',
            alt: 'Tomato slice',
            className: 'w-10 md:w-14 top-[60%] right-[25%]',
          },
        ]}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/menu">
            <Button variant="hero" size="xl">
              <UtensilsCrossed className="h-5 w-5" />
              View Menu
            </Button>
          </Link>
          <Link to="/booking">
            <Button variant="hero-outline" size="xl">
              <Calendar className="h-5 w-5" />
              Book a Table
            </Button>
          </Link>
        </div>
      </FloatingFoodHero>

      {/* Features Section */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-h2 lg:text-3xl mb-4">Why Choose Bhojanālaya?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
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
                className="group p-6 lg:p-8 bg-card rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300"
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

      {/* Popular Items Preview */}
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-h2 lg:text-3xl mb-2">Popular Dishes</h2>
              <p className="text-muted-foreground">Most loved by our customers</p>
            </div>
            <Link to="/menu">
              <Button variant="ghost" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
            {popularItems.map((item) => (
              <MenuItemCard
                key={item.id}
                imageUrl={item.image}
                isVegetarian={true} // Majority are veg in popular
                name={item.name}
                price={item.price}
                originalPrice={Math.round(item.price * 1.4)}
                quantity="Serves 1"
                prepTimeInMinutes={15}
                onAdd={() => console.log(`Added ${item.name}`)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-8 lg:p-16 text-center">
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
