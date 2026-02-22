import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, FileText, AlertCircle } from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "February 22, 2026";

  return (
    <div className="container px-6 py-20 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="farmers-badge mx-auto w-fit">
            <Lock className="w-3 h-3" />
            <span>Privacy Matters</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading text-primary">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground font-serif italic">
            Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="organic-card p-8 sm:p-12 bg-card border-2 border-primary/5 space-y-10 text-muted-foreground leading-relaxed">
          <section className="bg-secondary/5 -mx-8 -mt-8 p-8 border-b border-primary/10 mb-8 rounded-t-3xl">
            <div className="flex items-center gap-3 text-secondary mb-3">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-xl font-heading">
                Student Project Disclaimer
              </h2>
            </div>
            <p className="text-sm italic">
              <strong>Important:</strong> Bhojanālaya is a student portfolio
              project. This website is not a real restaurant ordering platform.
              No real financial transactions take place, and no real food orders
              will be fulfilled. All restaurant names and data are for
              demonstration purposes only.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-heading">1. Introduction</h2>
            </div>
            <p>
              Welcome to Bhojanālaya. We respect your privacy and are committed
              to protecting your personal data. This privacy policy will inform
              you as to how we look after your personal data when you visit our
              website or use our application.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-heading">2. Data We Collect</h2>
            </div>
            <p>
              We collect information that you provide directly to us when you
              create an account, make a reservation, or place an order. This may
              include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact data (name, email address, phone number).</li>
              <li>
                Transaction data (details about payments and services you have
                purchased).
              </li>
              <li>
                Technical data (IP address, login data, browser type and
                version).
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-heading">3. How We Use Your Data</h2>
            </div>
            <p>
              We use your data to provide our services, process your orders, and
              manage your account. This includes sending you order updates,
              tracking order status in real-time, and notifying you when your
              food is ready.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <Lock className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-heading">4. Data Security</h2>
            </div>
            <p>
              We have put in place appropriate security measures to prevent your
              personal data from being accidentally lost, used, or accessed in
              an unauthorized way. We limit access to your personal data to
              those employees, agents, and contractors who have a business need
              to know.
            </p>
          </section>

          <div className="pt-8 border-t border-primary/10">
            <p className="text-sm italic">
              If you have any questions about this privacy policy, please
              contact us at{" "}
              <span className="text-primary font-bold">
                privacy@bhojanālaya.com
              </span>
              .
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
