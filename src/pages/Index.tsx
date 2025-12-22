import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Clock, UtensilsCrossed, Users, ArrowRight, Sparkles, Calendar, Bell } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Real-Time Status",
    description: "Track your order from kitchen to table with live updates",
  },
  {
    icon: UtensilsCrossed,
    title: "Pre-Order Food",
    description: "Browse the menu and order ahead for faster service",
  },
  {
    icon: Users,
    title: "No Waiting Lines",
    description: "Reserve tables in advance and skip the queue",
  },
];

const popularItems = [
  {
    id: 1,
    name: "Grilled Salmon",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 2,
    name: "Beef Tenderloin",
    price: 32.99,
    image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 3,
    name: "Pasta Carbonara",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop",
    available: true,
  },
];

export default function HomePage() {
  return (
    <CustomerLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>New: Real-time order tracking</span>
            </div>
            
            <h1 className="font-heading text-h1 lg:text-5xl mb-6 text-foreground leading-tight">
              Skip the Queue.{" "}
              <span className="text-primary">Book Food Instantly.</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Reserve tables, pre-order your favorite dishes, and track your order in real-time. 
              No more waiting in lines.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/menu">
                <Button variant="hero" size="xl">
                  <UtensilsCrossed className="h-5 w-5" />
                  View Menu
                </Button>
              </Link>
              <Link to="/booking">
                <Button variant="hero-outline" size="xl">
                  <Calendar className="h-5 w-5" />
                  Book a Table
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2" />
      </section>
      
      {/* Features Section */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-h2 lg:text-3xl mb-4">Why Choose DineEase?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We've reimagined the dining experience to save you time and hassle
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="group p-6 lg:p-8 bg-card rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-heading text-h3 mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Items Preview */}
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-h2 lg:text-3xl mb-2">Popular Dishes</h2>
              <p className="text-muted-foreground">Most loved by our customers</p>
            </div>
            <Link to="/menu">
              <Button variant="ghost" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularItems.map((item, index) => (
              <div 
                key={item.id}
                className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                      Available
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold mb-2">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">${item.price}</span>
                    <Button size="sm" variant="secondary">
                      Add to Order
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-8 lg:p-16 text-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-medium">
                <Bell className="h-4 w-4" />
                <span>Get notified when your order is ready</span>
              </div>
              <h2 className="font-heading text-h2 lg:text-4xl mb-4 text-primary-foreground">
                Ready to Skip the Queue?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Book your table now and enjoy a seamless dining experience with real-time updates
              </p>
              <Link to="/booking">
                <Button 
                  variant="secondary" 
                  size="xl"
                  className="bg-card text-foreground hover:bg-card/90"
                >
                  Book Your Table Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}
