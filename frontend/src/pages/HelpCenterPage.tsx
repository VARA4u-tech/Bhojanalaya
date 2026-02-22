import { motion } from "framer-motion";
import {
  Search,
  HelpCircle,
  Book,
  MessageCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const faqs = [
  {
    q: "How do I track my order in real-time?",
    a: "Go to your 'Orders' page and select the active order. You'll see a live timeline from 'Waiting' to 'Ready'.",
  },
  {
    q: "Can I cancel my reservation?",
    a: "Yes, you can cancel up to 1 hour before the scheduled time through your 'Booking' history.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major UPI platforms (GPay, PhonePe), Credit/Debit Cards, and Net Banking via Stripe.",
  },
  {
    q: "What if my food is cold or incorrect?",
    a: "Please use the 'Report Issue' button on the order status page immediately so we can process a refund or replacement.",
  },
];

export default function HelpCenterPage() {
  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* ── Search Hero ── */}
      <section className="pt-24 pb-16 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <HelpCircle className="absolute -top-10 -left-10 w-64 h-64 rotate-12 text-primary" />
        </div>
        <div className="container px-6 relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h1 className="text-4xl sm:text-5xl font-heading text-primary mb-6">
              How can we help today?
            </h1>
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search for orders, bookings, policy..."
                className="h-16 pl-14 pr-6 rounded-2xl bg-card border-2 border-primary/10 transition-all focus:border-primary/30 text-lg shadow-soft-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="container px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <HelpCategory
          icon={Book}
          title="Getting Started"
          description="Learn how to browse menus, make orders, and reserve tables effectively."
        />
        <HelpCategory
          icon={MessageCircle}
          title="Orders & Payments"
          description="Everything about tracking your food, handling payments, and receipts."
        />
        <HelpCategory
          icon={AlertCircle}
          title="Troubleshooting"
          description="Fix common issues with app performance, account access, or order delays."
        />
      </section>

      {/* ── FAQs ── */}
      <section className="container px-6 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-heading text-foreground mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="organic-card p-6 bg-card border border-primary/5 hover:border-primary/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-primary text-lg">{faq.q}</h3>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
              </div>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed max-h-0 overflow-hidden group-hover:max-h-[100px] transition-all duration-500">
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="container px-6 text-center">
        <div className="p-10 organic-card bg-primary text-primary-foreground">
          <h3 className="text-2xl font-heading mb-4">Still have questions?</h3>
          <p className="mb-6 opacity-80">
            Our support team is available 24/7 to help you with any issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center font-bold tracking-widest uppercase text-xs">
            <a
              href="mailto:support@bhojanālaya.com"
              className="px-8 py-4 bg-white text-primary rounded-xl hover:bg-white/90 transition-all"
            >
              Email Support
            </a>
            <a
              href="tel:+918661234567"
              className="px-8 py-4 bg-primary-foreground/20 text-white rounded-xl hover:bg-primary-foreground/30 transition-all"
            >
              Call Hot Line
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function HelpCategory({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="organic-card p-8 bg-card flex flex-col items-center text-center hover:shadow-soft-xl transition-all border-2 border-transparent hover:border-primary/10">
      <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-heading mb-3 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
