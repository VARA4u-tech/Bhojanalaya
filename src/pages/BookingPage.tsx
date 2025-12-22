import { useState } from "react";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const timeSlots = [
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"
];

const tables = [
  { id: 1, seats: 2, available: true },
  { id: 2, seats: 2, available: true },
  { id: 3, seats: 4, available: false },
  { id: 4, seats: 4, available: true },
  { id: 5, seats: 4, available: true },
  { id: 6, seats: 6, available: true },
  { id: 7, seats: 6, available: false },
  { id: 8, seats: 8, available: true },
];

const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedGuests, setSelectedGuests] = useState<number>(2);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  
  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
    };
  });
  
  const availableTables = tables.filter(
    (table) => table.available && table.seats >= selectedGuests
  );
  
  const isFormComplete = selectedDate && selectedTime && selectedTable;
  
  return (
    <CustomerLayout>
      <div className="container py-6 lg:py-10 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-heading text-h1 mb-2">Book a Table</h1>
          <p className="text-muted-foreground">Reserve your spot for a seamless dining experience</p>
        </div>
        
        {/* Booking Form */}
        <div className="space-y-8">
          {/* Date Selection */}
          <section className="bg-card rounded-2xl p-6 shadow-soft animate-slide-up">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-heading text-h3">Select Date</h2>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
              {dates.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDate(d.value)}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200",
                    selectedDate === d.value
                      ? "border-primary bg-primary text-primary-foreground shadow-soft"
                      : "border-border bg-background hover:border-primary/50 hover:bg-muted"
                  )}
                >
                  <span className="text-xs font-medium opacity-70">{d.day}</span>
                  <span className="text-xl font-bold">{d.date}</span>
                  <span className="text-xs">{d.month}</span>
                </button>
              ))}
            </div>
          </section>
          
          {/* Time Selection */}
          <section className="bg-card rounded-2xl p-6 shadow-soft animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-heading text-h3">Select Time</h2>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={cn(
                    "px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200",
                    selectedTime === time
                      ? "border-primary bg-primary text-primary-foreground shadow-soft"
                      : "border-border bg-background hover:border-primary/50 hover:bg-muted"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </section>
          
          {/* Guest Selection */}
          <section className="bg-card rounded-2xl p-6 shadow-soft animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-heading text-h3">Number of Guests</h2>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {guestOptions.map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setSelectedGuests(num);
                    setSelectedTable(null);
                  }}
                  className={cn(
                    "w-12 h-12 rounded-xl border-2 font-bold transition-all duration-200",
                    selectedGuests === num
                      ? "border-primary bg-primary text-primary-foreground shadow-soft"
                      : "border-border bg-background hover:border-primary/50 hover:bg-muted"
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
          </section>
          
          {/* Table Selection */}
          <section className="bg-card rounded-2xl p-6 shadow-soft animate-slide-up" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="8" width="18" height="8" rx="2" />
                    <path d="M5 8V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2" />
                  </svg>
                </div>
                <h2 className="font-heading text-h3">Select Table</h2>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-accent" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted" />
                  <span>Occupied</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {tables.map((table) => {
                const isAvailable = table.available && table.seats >= selectedGuests;
                const isSelected = selectedTable === table.id;
                
                return (
                  <button
                    key={table.id}
                    onClick={() => isAvailable && setSelectedTable(table.id)}
                    disabled={!isAvailable}
                    className={cn(
                      "relative p-4 rounded-2xl border-2 transition-all duration-200 text-center",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-soft-lg"
                        : isAvailable
                        ? "border-accent/50 bg-accent/10 hover:border-primary hover:bg-primary/10"
                        : "border-muted bg-muted/50 cursor-not-allowed opacity-50"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-5 w-5" />
                      </div>
                    )}
                    <div className="font-bold text-lg mb-1">Table {table.id}</div>
                    <div className={cn(
                      "text-sm",
                      isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {table.seats} seats
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
          
          {/* Booking Summary */}
          {isFormComplete && (
            <section className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground shadow-soft-lg animate-slide-up">
              <h2 className="font-heading text-h3 mb-4">Booking Summary</h2>
              <div className="grid sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-primary-foreground/10 rounded-xl p-3">
                  <div className="text-sm opacity-70">Date</div>
                  <div className="font-semibold">
                    {new Date(selectedDate).toLocaleDateString("en-US", { 
                      weekday: "short", 
                      month: "short", 
                      day: "numeric" 
                    })}
                  </div>
                </div>
                <div className="bg-primary-foreground/10 rounded-xl p-3">
                  <div className="text-sm opacity-70">Time</div>
                  <div className="font-semibold">{selectedTime}</div>
                </div>
                <div className="bg-primary-foreground/10 rounded-xl p-3">
                  <div className="text-sm opacity-70">Guests</div>
                  <div className="font-semibold">{selectedGuests} people</div>
                </div>
                <div className="bg-primary-foreground/10 rounded-xl p-3">
                  <div className="text-sm opacity-70">Table</div>
                  <div className="font-semibold">Table {selectedTable}</div>
                </div>
              </div>
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full bg-card text-foreground hover:bg-card/90"
              >
                Confirm Booking
              </Button>
            </section>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
