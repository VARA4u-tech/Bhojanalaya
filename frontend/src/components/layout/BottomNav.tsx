import { Link, useLocation } from "react-router-dom";
import { Home, UtensilsCrossed, ClipboardList, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/menu", icon: UtensilsCrossed, label: "Menu" },
    { href: "/orders", icon: ClipboardList, label: "Orders" },
    { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
    const location = useLocation();

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden w-[90%] max-w-[400px]">
            <div className="bg-background/80 backdrop-blur-2xl border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[2rem] px-4 py-2 flex items-center justify-between">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <motion.div whileTap={{ scale: 0.9 }} key={item.href} className={cn(isActive && "flex-1")}>
                            <Link
                                to={item.href}
                                className={cn(
                                    "relative flex flex-col items-center justify-center gap-1.5 px-2 xs:px-4 py-2 rounded-2xl transition-all duration-300",
                                    isActive ? "text-primary w-full" : "text-muted-foreground"
                                )}
                            >
                                <div className={cn(
                                    "relative z-10 p-2 rounded-xl transition-all duration-300",
                                    isActive && "bg-primary/10 shadow-inner"
                                )}>
                                    <item.icon className={cn(
                                        "h-5 w-5 transition-transform duration-300",
                                        isActive ? "scale-110" : "scale-100"
                                    )} />
                                </div>

                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
                                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                                )}>
                                    {item.label}
                                </span>

                                {isActive && (
                                    <motion.div
                                        layoutId="bottom-nav-active"
                                        className="absolute inset-0 bg-primary/5 rounded-2xl"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </nav>
    );
}
