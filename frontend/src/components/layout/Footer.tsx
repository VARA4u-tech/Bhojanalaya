import React from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  MapPin,
  Phone,
  UtensilsCrossed,
  Heart,
  Leaf,
  Sparkles,
  Github,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const footerLinks = [
  {
    title: "Project",
    links: [
      { label: "Overview", href: "/about" },
      { label: "Technical Stack", href: "/about#tech" },
      { label: "Our Story", href: "/about" },
      { label: "Project Roadmap", href: "/docs" },
      {
        label: "GitHub Repository",
        href: "https://github.com/VARA4u-tech/Bhojanalaya",
      },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Refund Policy", href: "/refund" },
    ],
  },
  {
    title: "Site Map",
    links: [
      { label: "Browse Menu", href: "/menu" },
      { label: "Book Table", href: "/booking" },
      { label: "View Orders", href: "/orders" },
      { label: "User Dashboard", href: "/dashboard" },
    ],
  },
];

const SocialIcon = ({ icon: Icon, href }: { icon: LucideIcon; href: string }) => (
  <a
    href={href}
    className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 border border-primary/20"
  >
    <Icon className="h-5 w-5" />
  </a>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* ── Decorative Organic Top Border ── */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary/20" />

      {/* ── Background Elements ── */}
      <div className="absolute inset-0 bg-card pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 pt-16 pb-24 sm:pb-32 lg:pb-12 lg:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* ── Brand Section ── */}
          <div className="lg:col-span-4 flex flex-col items-start gap-6">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="h-10 sm:h-12 flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform duration-500">
                <img
                  src="/brand/logo.png"
                  alt="Bhojanālaya"
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm font-serif italic">
              "A comprehensive full-stack student project demonstrating a modern
              dining reservation and food ordering ecosystem. Built with a focus
              on real-time UX and premium design."
            </p>

            <div className="farmers-badge bg-secondary/10 border-secondary/20 text-secondary py-1 scale-90 -ml-1">
              <Sparkles className="w-3 h-3" />
              <span>Academic Portfolio Project</span>
            </div>

            <div className="flex items-center gap-3">
              <SocialIcon icon={Github} href="ht" />
              <SocialIcon
                icon={Linkedin}
                href="https://www.linkedin.com/in/durga-vara-prasad-pappuri-1797701b6/"
              />
              <SocialIcon icon={Mail} href="#" />
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-10 w-10 text-primary" />
                <span>
                  DR. HS & DVR MIC College Of Technology,(Approved by AICTE &
                  Permanently Affiliated to JNTUK, Kakinada) Kanchikacherl
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 9550533315</span>
              </div>
            </div>
          </div>

          {/* ── Links Sections ── */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
              {footerLinks.map((group) => (
                <div key={group.title} className="flex flex-col gap-6">
                  <h4 className="font-heading text-lg text-foreground tracking-wide flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-secondary/60" />
                    {group.title}
                  </h4>
                  <ul className="flex flex-col gap-4">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.href}
                          className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group"
                        >
                          <span className="h-1 w-0 bg-primary rounded-full transition-all duration-300 group-hover:w-2" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* ── Newsletter / Note Section ── */}
            <div className="mt-12 organic-card p-6 bg-primary/5 border-primary/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 text-primary/10 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                <Leaf className="w-16 h-16" />
              </div>
              <div className="relative z-10">
                <h5 className="font-heading text-primary mb-2 flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4 text-secondary" />
                  Technical Showcase
                </h5>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  This platform is a prototype built for educational purposes.
                  It showcases advanced React patterns, real-time socket
                  communication, and scalable backend architecture.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-8 mt-8 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-[0.7rem] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <span>&copy; {currentYear} Bhojanālaya. All Rights Reserved.</span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-primary/30" />
            <span className="flex items-center gap-1">
              Handcrafted by{" "}
              <Link
                to="https://github.com/VARA4u-tech/Bhojanalaya"
                className="text-primary hover:text-secondary hover:underline underline-offset-4 transition-colors"
              >
                VARA.
              </Link>
            </span>
          </div>

          <div className="flex items-center gap-6 text-[0.7rem] sm:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="flex items-center gap-1.5 group cursor-help">
              Made with{" "}
              <Heart className="h-3 w-3 text-secondary fill-secondary animate-pulse-soft" />{" "}
              in India
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom Decorative Frame Overlay ── */}
      <div className="absolute bottom-4 left-4 right-4 h-12 rounded-t-[2rem] border-t-2 border-x-2 border-primary/10 pointer-events-none lg:block hidden" />
    </footer>
  );
}
