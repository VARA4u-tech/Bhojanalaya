import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/userStore";
import { Loader2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function LoginView() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useUserStore();
    const { toast } = useToast();
    const [sent, setSent] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        const { error } = await login(email);
        setIsLoading(false);

        if (error) {
            toast({
                title: "Error logging in",
                description: error.message,
                variant: "destructive"
            });
        } else {
            setSent(true);
            toast({
                title: "Magic Link Sent",
                description: "Check your email for the login link!",
            });
        }
    };

    if (sent) {
        return (
            <div className="max-w-md mx-auto p-8 bg-card/70 backdrop-blur-md rounded-2xl border border-border/50 shadow-soft text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-2">Check your inbox</h3>
                <p className="text-muted-foreground mb-6">
                    We sent a magic link to <span className="font-medium text-foreground">{email}</span>.
                    Click the link to sign in instantly.
                </p>
                <div className="flex flex-col gap-3">
                    <Button variant="outline" onClick={() => setSent(false)} className="rounded-xl border-dashed">
                        Try different email
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleLogin} className="max-w-md mx-auto p-8 bg-card/70 backdrop-blur-md rounded-2xl border border-border/50 shadow-soft space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center">
                <h2 className="text-3xl font-heading font-bold mb-2">Welcome Back</h2>
                <p className="text-muted-foreground">Sign in to track orders & manage your profile</p>
            </div>

            <div className="space-y-2 text-left">
                <label htmlFor="email" className="text-sm font-medium ml-1">Email Address</label>
                <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-xl h-12 bg-background/50 border-input/50 focus:border-primary/50"
                />
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl text-md font-medium shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Send Magic Link"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
                We'll email you a magic link for a password-free sign in.
            </p>
        </form>
    );
}
