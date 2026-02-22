import { motion } from "framer-motion";
import { Scale, FileText, CheckCircle2 } from "lucide-react";

export default function TermsOfServicePage() {
  const lastUpdated = "February 22, 2026";

  return (
    <div className="container px-6 py-20 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4 mb-16">
          <div className="farmers-badge mx-auto w-fit">
            <Scale className="w-3 h-3" />
            <span>Usage Guidelines</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading text-primary">
            Project Usage & Terms
          </h1>
          <p className="text-muted-foreground font-serif italic">
            Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="organic-card p-8 sm:p-12 bg-card border-2 border-primary/5 space-y-10 text-muted-foreground leading-relaxed">
          <section className="bg-secondary/5 -mx-8 -mt-8 p-8 border-b border-primary/10 mb-8 rounded-t-3xl">
            <div className="flex items-center gap-3 text-secondary mb-3">
              <Scale className="w-6 h-6" />
              <h2 className="text-xl font-heading">Educational Use Only</h2>
            </div>
            <p className="text-sm italic">
              This platform is developed strictly for academic and portfolio
              purposes. All interactions, data, and services provided are
              simulated and should not be used for real-world commercial
              activities.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-heading">1. Acceptable Use</h2>
            </div>
            <p>
              Users are encouraged to explore the features of this prototype
              responsibly. Any attempt to exploit the system or its simulated
              database is discouraged.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-heading">2. Use of Services</h2>
            </div>
            <p>
              You must be at least 18 years old to use our services. You agree
              to use the platform only for lawful purposes and in a way that
              does not infringe on the rights of others. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing accurate information when creating an account.</li>
              <li>Not impersonating any person or entity.</li>
              <li>
                Not attempting to interfere with the proper working of the
                platform.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-heading">3. Booking & Ordering</h2>
            </div>
            <p>
              When you make a reservation or place an order, you are entering
              into a contract with the respective restaurant. Bhojanālaya acts
              as an intermediary to facilitate these transactions. Restaurants
              are responsible for the quality of food and service.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <Scale className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-heading">
                4. Limitation of Liability
              </h2>
            </div>
            <p>
              To the maximum extent permitted by law, Bhojanālaya shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages resulting from your use of the services.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
