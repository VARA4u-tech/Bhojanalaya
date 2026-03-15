import { motion } from "framer-motion";
import {
  Briefcase,
  Rocket,
  Coffee,
  Heart,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const openings = [
  { title: "Operations Manager", Type: "Full-time", Location: "Vijayawada" },
  {
    title: "Senior Backend Developer",
    Type: "Remote / Hybrid",
    Location: "Vijayawada",
  },
  { title: "Customer Success Lead", Type: "Full-time", Location: "Vijayawada" },
  {
    title: "Quality Assurance Specialist",
    Type: "Contract",
    Location: "Vijayawada",
  },
];

export default function ProjectDocsPage() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* ── Hero ── */}
      <section className="pt-24 pb-12 container px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="farmers-badge mb-4 mx-auto w-fit">
            <Rocket className="w-4 h-4" />
            <span>Development Roadmap</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-heading text-primary mb-6">
            Project Documentation & Roadmap
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground font-serif italic text-lg leading-relaxed">
            "Bhojanālaya was built as a capstone project to explore the limits
            of modern web technologies. This page outlines the project's
            development phases and key technical milestones."
          </p>
        </motion.div>
      </section>

      {/* ── Phases ── */}
      <section className="container px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <PerkCard
          icon={Rocket}
          title="UI/UX Prototyping"
          description="Crafting a premium glassmorphism design system that works seamlessly across all device sizes."
        />
        <PerkCard
          icon={Briefcase}
          title="Full-Stack Integration"
          description="Implementing real-time order tracking and secure authentication using Supabase and Node.js."
        />
        <PerkCard
          icon={Heart}
          title="Performance Tuning"
          description="Optimizing lighthouse scores through code-splitting, lazy loading, and efficient asset management."
        />
      </section>

      {/* ── Roadmap ── */}
      <section className="container px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading text-foreground mb-4">
            Development Phases
          </h2>
          <p className="text-muted-foreground italic font-serif">
            A journey from concept to code
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <PhaseItem
            title="Phase 1: Research & Discovery"
            status="Completed"
            desc="Analyzing current dining bottlenecks and designing the technical architecture."
          />
          <PhaseItem
            title="Phase 2: Core Development"
            status="Completed"
            desc="Building the frontend UI components and the initial Express.js API structure."
          />
          <PhaseItem
            title="Phase 3: Real-Time Services"
            status="Completed"
            desc="Implementing Socket.io for live order status and transaction notifications."
          />
          <PhaseItem
            title="Phase 4: Optimization & Launch"
            status="In Progress"
            desc="Final performance audits and production-ready deployment preparation."
          />
        </div>

        <div className="text-center mt-12 p-8 organic-card bg-secondary/5 border-secondary/10">
          <h3 className="font-heading text-primary mb-2">Technical Inquiry?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Interested in the code behind the project? Check out the{" "}
            <a
              href="https://github.com/VARA4u-tech/bitebook-direct"
              className="font-bold underline"
            >
              GitHub Repo
            </a>{" "}
            or contact the developer.
          </p>
        </div>
      </section>
    </div>
  );
}

function PhaseItem({
  title,
  status,
  desc,
}: {
  title: string;
  status: string;
  desc: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="organic-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/30 transition-all group"
    >
      <div>
        <h3 className="text-lg font-heading text-primary">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      </div>
      <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest shrink-0 w-fit">
        {status}
      </div>
    </motion.div>
  );
}

function PerkCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 organic-card bg-card border-none shadow-soft-xl">
      <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4 text-primary">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-heading mb-2 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
