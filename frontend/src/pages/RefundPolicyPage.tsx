import { motion } from "framer-motion";
import { RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RefundPolicyPage() {
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
            <RotateCcw className="w-3 h-3" />
            <span>Customer First</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading text-primary">
            Refund Policy
          </h1>
          <p className="text-muted-foreground font-serif italic">
            Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="organic-card p-8 sm:p-12 bg-card border-2 border-primary/5 space-y-10 text-muted-foreground leading-relaxed">
          <section className="bg-secondary/5 -mx-8 -mt-8 p-8 border-b border-primary/10 mb-8 rounded-t-3xl">
            <div className="flex items-center gap-3 text-secondary mb-3">
              <RotateCcw className="w-6 h-6" />
              <h2 className="text-xl font-heading">Simulation Disclaimer</h2>
            </div>
            <p className="text-sm italic">
              As this is a student project, no real payments are processed and
              no real refunds are issued. The refund policy below is a
              demonstration of how a commercial version of this app would handle
              financial transactions.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-heading">1. General Principles</h2>
            </div>
            <p>
              At Bhojanālaya, we strive for 100% customer satisfaction. However,
              since we deal with perishable food items prepared by independent
              restaurants, our refund policy is designed to be fair to both
              customers and our restaurant partners.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-heading">2. Eligible for Refund</h2>
            </div>
            <p>
              You may be eligible for a refund or credit in the following
              scenarios:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The order was cancelled by the restaurant.</li>
              <li>The items delivered were incorrect or missing.</li>
              <li>
                There was a significant delay in preparation (beyond 60 minutes
                of estimated time).
              </li>
              <li>Food quality issues (requires proof/photos).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-heading">
                3. Non-Refundable Scenarios
              </h2>
            </div>
            <p>Refunds are typically not provided if:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The customer provided an incorrect delivery address or contact
                info.
              </li>
              <li>
                The customer cancelled the order after it was already being
                prepared.
              </li>
              <li>
                Subjective preferences (e.g., "didn't like the taste" despite
                being prepared correctly).
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <RotateCcw className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-heading">4. Process</h2>
            </div>
            <p>
              To request a refund, please use the "Report Issue" button on your
              order status page within 2 hours of delivery. Our support team
              will investigate and process eligible refunds within 3-5 business
              days.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
