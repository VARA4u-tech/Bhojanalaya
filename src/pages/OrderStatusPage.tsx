import { useState, useEffect } from "react";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge, OrderStatus } from "@/components/ui/status-badge";
import { Clock, MapPin, ChefHat, Bell, Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const orderSteps: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: "waiting", label: "Order Placed", icon: Clock },
  { status: "confirmed", label: "Confirmed", icon: Check },
  { status: "preparing", label: "Preparing", icon: ChefHat },
  { status: "ready", label: "Ready", icon: Bell },
];

const mockOrder = {
  id: "ORD-2024-001",
  status: "preparing" as OrderStatus,
  items: [
    { name: "Grilled Salmon", quantity: 1, price: 24.99 },
    { name: "Caesar Salad", quantity: 2, price: 12.99 },
    { name: "Fresh Lemonade", quantity: 2, price: 4.99 },
  ],
  table: 5,
  estimatedTime: "15 mins",
  placedAt: "12:30 PM",
};

export default function OrderStatusPage() {
  const [currentStep, setCurrentStep] = useState(2); // 0-indexed, "preparing" is step 2
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Simulate status change
  const simulateProgress = () => {
    if (currentStep < orderSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsAnimating(false);
      }, 500);
    }
  };
  
  const total = mockOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return (
    <CustomerLayout>
      <div className="container py-6 lg:py-10 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-h1 mb-2">Order Status</h1>
          <p className="text-muted-foreground">Track your order in real-time</p>
        </div>
        
        {/* Order Info Card */}
        <div className="bg-card rounded-2xl p-6 shadow-soft mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground">Order ID</div>
              <div className="font-heading font-bold text-lg">{mockOrder.id}</div>
            </div>
            <StatusBadge status={orderSteps[currentStep].status} />
          </div>
          
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Table {mockOrder.table}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Placed at {mockOrder.placedAt}</span>
            </div>
          </div>
        </div>
        
        {/* Progress Stepper */}
        <div className="bg-card rounded-2xl p-6 shadow-soft mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <h2 className="font-heading text-h3 mb-6">Order Progress</h2>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-muted">
              <div 
                className="absolute top-0 left-0 w-full bg-primary transition-all duration-500"
                style={{ height: `${(currentStep / (orderSteps.length - 1)) * 100}%` }}
              />
            </div>
            
            {/* Steps */}
            <div className="space-y-6">
              {orderSteps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const isPending = index > currentStep;
                
                return (
                  <div 
                    key={step.status}
                    className={cn(
                      "relative flex items-start gap-4 transition-all duration-300",
                      isPending && "opacity-40"
                    )}
                  >
                    {/* Icon Circle */}
                    <div className={cn(
                      "relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                      isCompleted && "bg-status-ready text-accent-foreground",
                      isCurrent && "bg-primary text-primary-foreground shadow-soft-lg animate-progress-pulse",
                      isPending && "bg-muted text-muted-foreground"
                    )}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <div className={cn(
                        "font-heading font-semibold",
                        isCurrent && "text-primary"
                      )}>
                        {step.label}
                      </div>
                      {isCurrent && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {step.status === "preparing" 
                            ? `Estimated time: ${mockOrder.estimatedTime}` 
                            : "Just now"}
                        </div>
                      )}
                      {isCompleted && (
                        <div className="text-sm text-status-ready mt-1">
                          Completed
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Demo button */}
          {currentStep < orderSteps.length - 1 && (
            <Button 
              onClick={simulateProgress}
              disabled={isAnimating}
              variant="outline"
              className="w-full mt-6"
            >
              <RefreshCw className={cn("h-4 w-4", isAnimating && "animate-spin")} />
              Simulate Next Status
            </Button>
          )}
        </div>
        
        {/* Order Details */}
        <div className="bg-card rounded-2xl p-6 shadow-soft animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h2 className="font-heading text-h3 mb-4">Order Details</h2>
          
          <div className="space-y-4 mb-6">
            {mockOrder.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground ml-2">×{item.quantity}</span>
                </div>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-lg">Total</span>
              <span className="font-heading font-bold text-xl text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
