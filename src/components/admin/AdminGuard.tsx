import { useState, ReactNode } from "react";
import { useAdminStore } from "@/store/adminStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, UtensilsCrossed, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminGuardProps {
    children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
    const { isAuthorized, authorize } = useAdminStore();
    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (authorize(passcode)) {
            setError(false);
        } else {
            setError(true);
            setPasscode("");
            // Animation feedback
            setTimeout(() => setError(false), 500);
        }
    };

    if (isAuthorized) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 shadow-soft">
                        <UtensilsCrossed className="h-8 w-8" />
                    </div>
                    <h1 className="font-heading text-h2 mb-2 font-bold">Bhojanālaya Admin</h1>
                    <p className="text-muted-foreground">Please enter your administrative passcode</p>
                </div>

                <div className="bg-card/50 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-soft-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Passcode</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <motion.div
                                    animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                                    transition={{ duration: 0.4 }}
                                >
                                    <Input
                                        type="password"
                                        placeholder="••••"
                                        value={passcode}
                                        onChange={(e) => setPasscode(e.target.value)}
                                        className={cn(
                                            "pl-0 h-14 bg-background/50 border-border rounded-xl text-2xl tracking-[0.5em] text-center transition-all focus:ring-primary focus:border-primary",
                                            error && "border-destructive ring-1 ring-destructive"
                                        )}
                                        maxLength={4}
                                        autoFocus
                                    />
                                </motion.div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 rounded-xl text-lg font-heading shadow-glow hover:shadow-glow-lg transition-all"
                        >
                            Access Console
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <span>Simulated Security v1.0</span>
                        <span>Passcode: 1234</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// Helper for class consolidation in the guard
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
