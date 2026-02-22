import { motion } from "framer-motion";
import { Leaf, Heart, Users, Sparkles, ChefHat, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* ── Hero Section ── */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <div className="container relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="farmers-badge mb-6 mx-auto w-fit">
              <Sparkles className="w-4 h-4" />
              <span>Academic Showcase</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading text-primary mb-6">
              Engineering a Modern Dining Experience
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground font-serif italic">
              "Bhojanālaya is a full-stack student initiative designed to solve
              real-world dining inefficiencies through elegant code and
              real-time connectivity."
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="container px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-heading text-foreground" id="tech">
              The Technical Vision
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              As a student project, Bhojanālaya was developed with the primary
              goal of exploring the synergy between real-time data flow and
              high-fidelity user interfaces. The challenge was to create an
              ordering system that feels as fast as a native app while remaining
              fully accessible through the web.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Built using <strong>React 18</strong>, <strong>Express.js</strong>
              , and <strong>Supabase</strong>, the project leverages modern
              development practices like Zod for schema validation, Zustand for
              state management, and Framer Motion for immersive animations.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                <Heart className="w-5 h-5 text-secondary fill-secondary" />
                Pure Love
              </div>
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                <ChefHat className="w-5 h-5 text-secondary" />
                Master Chefs
              </div>
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                <Sparkles className="w-5 h-5 text-secondary" />
                Local Source
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="organic-card p-8 bg-primary/5 border-primary/20 aspect-square flex flex-col items-center justify-center text-center gap-6 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ChefHat className="w-32 h-32" />
              </div>
              <Award className="w-16 h-16 text-secondary animate-pulse-soft" />
              <h3 className="text-2xl font-heading text-primary">
                Celebrating 10+ Years of Culinary Excellence
              </h3>
              <p className="text-sm text-muted-foreground">
                From a single small kitchen to serving thousands across the
                city, our commitment to taste remains unshaken.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-primary/5 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="container px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading text-foreground mb-4">
              What Defines Us
            </h2>
            <div className="h-1 w-20 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ValueCard
              icon={Leaf}
              title="Locally Sourced"
              description="We prioritize ingredients from local farmers and markets, ensuring peak freshness in every dish."
            />
            <ValueCard
              icon={Users}
              title="Community First"
              description="Supporting local businesses and creating a platform where artisans can thrive is at our core."
            />
            <ValueCard
              icon={Heart}
              title="Authenticity"
              description="No shortcuts. No compromises. Just the true, traditional taste you've grown to love."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="organic-card p-8 bg-card hover:shadow-soft-xl transition-all duration-300"
    >
      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-heading mb-3 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
