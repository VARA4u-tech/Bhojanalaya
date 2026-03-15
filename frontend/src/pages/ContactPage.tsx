import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* ── Header ── */}
      <section className="pt-20 pb-10 container px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="farmers-badge mb-4 mx-auto w-fit">
            <MessageSquare className="w-3 h-3" />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading text-primary mb-6">
            We'd Love to Hear From You
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground font-serif italic text-lg">
            Have a question, feedback, or just want to talk food? Reach out to
            us and we'll get back to you as fast as we cook our idlis!
          </p>
        </motion.div>
      </section>

      {/* ── Contact Grid ── */}
      <section className="container px-6 grid lg:grid-cols-12 gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-8">
          <ContactInfoCard
            icon={Mail}
            title="Email Us"
            value="hello@bhojanālaya.com"
            description="Our response time is typically within 24 hours."
          />
          <ContactInfoCard
            icon={Phone}
            title="Call Us"
            value="+91 866 123 4567"
            description="Mon - Sat, 9am - 7pm IST"
          />
          <ContactInfoCard
            icon={MapPin}
            title="Visit Us"
            value="MG Road, Vijayawada, AP"
            description="Our central office in the heart of the city."
          />

          <div className="organic-card p-8 bg-secondary/5 border-secondary/20 relative overflow-hidden group">
            <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-secondary/10 group-hover:rotate-12 transition-transform duration-700" />
            <h3 className="text-xl font-heading text-primary mb-2">
              Partner with Us?
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Are you a restaurant owner looking to reach more customers? Join
              our ever-growing family of local kitchens.
            </p>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5"
            >
              Restaurant Registration
            </Button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="organic-card p-8 sm:p-10 bg-card border-2 border-primary/10 shadow-soft-xl"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Full Name
                  </label>
                  <Input
                    placeholder="Arjun Reddy"
                    className="bg-background/50 border-primary/10 focus:border-primary/30 rounded-xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Email Address
                  </label>
                  <Input
                    placeholder="arjun@example.com"
                    type="email"
                    className="bg-background/50 border-primary/10 focus:border-primary/30 rounded-xl h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Subject
                </label>
                <Input
                  placeholder="How can we help?"
                  className="bg-background/50 border-primary/10 focus:border-primary/30 rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Your Message
                </label>
                <Textarea
                  placeholder="Tell us more about your inquiry..."
                  className="bg-background/50 border-primary/10 focus:border-primary/30 rounded-xl min-h-[150px] resize-none"
                />
              </div>
              <Button
                size="xl"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading shadow-lg shadow-primary/20 h-14 rounded-2xl"
              >
                Send Message
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ContactInfoCard({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 text-primary">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-heading text-lg text-foreground">{title}</h3>
        <p className="text-primary font-bold">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}
