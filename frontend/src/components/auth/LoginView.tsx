import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/userStore";
import {
  Loader2,
  Mail,
  Lock,
  User,
  ArrowRight,
  Wand2,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { VegetableHero } from "./VegetableCharacters";
import { useNavigate } from "react-router-dom";

export function LoginView() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    loginWithPassword,
    signUpWithPassword,
    loginWithMagicLink,
    loginWithGoogle,
  } = useUserStore();
  const { toast } = useToast();

  // Form States
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Magic Link State
  const [showMagicLink, setShowMagicLink] = useState(false);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    if (showMagicLink) {
      const { error } = await loginWithMagicLink(email);
      setIsLoading(false);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Magic Link Sent",
          description: "Check your email for the login link!",
        });
      }
    } else {
      if (!password) {
        setIsLoading(false);
        return toast({
          title: "Password Required",
          description: "Please enter your password",
          variant: "destructive",
        });
      }
      const { error } = await loginWithPassword(email, password);
      setIsLoading(false);
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return toast({
        title: "Weak Password",
        description:
          "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
        variant: "destructive",
      });
    }

    if (!email || !password || !name) {
      return toast({
        title: "Missing Fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
    }

    setIsLoading(true);
    const { error } = await signUpWithPassword(email, password, name);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created",
        description: "Please check your email to verify your account.",
      });
      setActiveTab("login");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] w-full h-full overflow-hidden bg-background">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-[110] bg-black/10 hover:bg-black/20 text-foreground rounded-full backdrop-blur-md transition-all"
        onClick={() => navigate("/")}
      >
        <X className="h-6 w-6" />
      </Button>

      <VegetableHero
        variant={activeTab as "login" | "signup"}
        fullScreen={true}
      >
        <div className="relative z-50 w-full max-w-[440px] mx-4 overflow-y-auto max-h-[94vh] hide-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] bg-white/90 backdrop-blur-2xl border-2 border-white/60">
          <div className="p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-500 flex flex-col justify-center min-h-full">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">
                {activeTab === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {activeTab === "login"
                  ? "Enter your credentials to access your account"
                  : "Sign up to start your food journey"}
              </p>
            </div>

            <Tabs
              defaultValue="login"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8 h-12 rounded-xl bg-muted/50 p-1">
                <TabsTrigger
                  value="login"
                  className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <div className="space-y-4 mb-6">
                <Button
                  variant="outline"
                  type="button"
                  onClick={async () => {
                    setIsLoading(true);
                    const { error } = await loginWithGoogle();
                    if (error) {
                      toast({
                        title: "Authentication Failed",
                        description: error.message,
                        variant: "destructive",
                      });
                    }
                    setIsLoading(false);
                  }}
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl font-medium border-border hover:bg-muted/50 transition-all relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground font-medium">
                    Or continue with email
                  </span>
                </div>
              </div>

              <TabsContent
                value="login"
                className="space-y-4 mt-0 focus-visible:outline-none"
              >
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-12 rounded-2xl bg-white/50 backdrop-blur-sm border-white/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all duration-300"
                        required
                      />
                      <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary group-focus-within:scale-110 pointer-events-none transition-all duration-300" />
                    </div>
                  </div>

                  {!showMagicLink && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Button
                          variant="link"
                          className="p-0 h-auto text-xs text-primary font-normal hover:underline"
                          type="button"
                          onClick={() => setShowMagicLink(true)}
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <div className="relative group">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-12 pr-12 h-12 rounded-2xl bg-white/50 backdrop-blur-sm border-white/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all duration-300"
                          required={!showMagicLink}
                        />
                        <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary group-focus-within:scale-110 pointer-events-none transition-all duration-300" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-primary transition-all duration-300"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Processing...
                      </>
                    ) : showMagicLink ? (
                      "Send Magic Link"
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <div className="text-center">
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => setShowMagicLink(!showMagicLink)}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showMagicLink ? (
                        <>
                          <Lock className="mr-1.5 h-3 w-3" /> Back to password
                          login
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-1.5 h-3 w-3" /> Use magic link
                          instead
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent
                value="signup"
                className="space-y-4 mt-0 focus-visible:outline-none"
              >
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative group">
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-Z\s]*$/.test(value)) {
                            setName(value);
                          }
                        }}
                        className="pl-12 h-12 rounded-2xl bg-white/50 backdrop-blur-sm border-white/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all duration-300"
                        required
                      />
                      <User className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary group-focus-within:scale-110 pointer-events-none transition-all duration-300" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <div className="relative group">
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-12 rounded-2xl bg-white/50 backdrop-blur-sm border-white/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all duration-300"
                        required
                      />
                      <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary group-focus-within:scale-110 pointer-events-none transition-all duration-300" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Create Password</Label>
                    <div className="relative group">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 pr-12 h-12 rounded-2xl bg-white/50 backdrop-blur-sm border-white/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all duration-300"
                        required
                      />
                      <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary group-focus-within:scale-110 pointer-events-none transition-all duration-300" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-primary transition-all duration-300"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground ml-1">
                      Must include uppercase, lowercase, number & special char.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4 px-4 leading-relaxed">
                    By joining, you agree to our{" "}
                    <a
                      href="#"
                      className="underline decoration-dotted underline-offset-2 hover:text-primary hover:decoration-solid"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="underline decoration-dotted underline-offset-2 hover:text-primary hover:decoration-solid"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </form>
              </TabsContent>
            </Tabs>

            {/* Trust badge / simple footer */}
            <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <p className="text-xs text-foreground/70 flex items-center justify-center gap-2 font-medium">
                <Lock className="h-4 w-4" />
                <span>Secure Auth by Supabase</span>
              </p>
            </div>
          </div>
        </div>
      </VegetableHero>
    </div>
  );
}
