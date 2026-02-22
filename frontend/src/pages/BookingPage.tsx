import { useState, useEffect } from "react";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Check, MapPin, Trash2, ChevronRight, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingStore, useRestaurantStore } from "@/store";
import { useToast } from "@/hooks/use-toast";

const timeSlots = [
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"
];

const tables = [
  { id: 1, seats: 2, available: true, type: "Window Side" },
  { id: 2, seats: 2, available: true, type: "Terrace" },
  { id: 3, seats: 4, available: false, type: "Private Booth" },
  { id: 4, seats: 4, available: true, type: "Standard" },
  { id: 5, seats: 4, available: true, type: "Window Side" },
  { id: 6, seats: 6, available: true, type: "Private Booth" },
  { id: 7, seats: 6, available: false, type: "Terrace" },
  { id: 8, seats: 8, available: true, type: "Standard" },
];

const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];

export default function BookingPage() {
  const { restaurants, selectedRestaurant, selectRestaurant } = useRestaurantStore();
  const { bookings, addBooking, cancelBooking } = useBookingStore();
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedGuests, setSelectedGuests] = useState<number>(2);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isCelebration, setIsCelebration] = useState<boolean>(false);
  const [occasion, setOccasion] = useState<string>("");

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

  const isFormComplete = selectedRestaurant && selectedDate && selectedTime && selectedTable;

  const handleBooking = () => {
    if (!isFormComplete || !selectedRestaurant) return;

    addBooking({
      restaurantId: selectedRestaurant.id,
      restaurantName: selectedRestaurant.name,
      date: new Date(selectedDate),
      time: selectedTime,
      guests: selectedGuests,
      tableNumber: selectedTable.toString(),
      name: "Current User",
      email: "user@example.com",
      phone: "555-0123",
    });

    toast({
      title: "Booking Confirmed!",
      description: `Your table at ${selectedRestaurant.name} for ${selectedGuests} people is reserved.`,
    });

    // Reset form
    setSelectedTime("");
    setSelectedTable(null);
    setActiveStep(1); // Optional: go back to first step or stay
  };

  return (
    <div className="container py-6 lg:py-10 max-w-4xl">
      {/* Header */}
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="font-heading text-h1 mb-2">Book a Table</h1>
        <p className="text-muted-foreground">Reserve your spot for a seamless dining experience</p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center justify-center gap-4 mb-10 overflow-x-auto pb-4">
        {[
          { id: 1, label: "Restaurant", icon: Store },
          { id: 2, label: "Date & Time", icon: Calendar },
          { id: 3, label: "Guests & Table", icon: Users },
        ].map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={cn(
              "flex flex-col items-center gap-2",
              activeStep === step.id ? "text-primary" : "text-muted-foreground"
            )}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                activeStep === step.id ? "border-primary bg-primary/10" : "border-border"
              )}>
                <step.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium whitespace-nowrap">{step.label}</span>
            </div>
            {index < 2 && (
              <div className="mx-4 w-12 h-0.5 bg-border mt-[-20px]" />
            )}
          </div>
        ))}
      </div>

      {/* Booking Form */}
      <div className="space-y-8">
        {/* Restaurant Selection */}
        {activeStep === 1 && (
          <section className="bg-card rounded-2xl p-6 shadow-soft animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-heading text-h3">Choose restaurant</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">

              {restaurants.map((r) => (

                <button

                  key={r.id}

                  onClick={() => {

                    selectRestaurant(r.id);

                    setActiveStep(2);

                  }}

                  className={cn(

                    "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left",

                    selectedRestaurant?.id === r.id

                      ? "border-primary bg-primary/5"

                      : "border-border hover:border-primary/50"

                  )}

                  aria-label={`Select ${r.name}`} // Added aria-label

                >

                  <img src={r.image} className="w-16 h-16 rounded-xl object-cover" alt={r.name} />

                  <div className="flex-1">

                    <div className="font-bold">{r.name}</div>

                    <div className="text-sm text-muted-foreground">{r.cuisine}</div>

                  </div>

                  {selectedRestaurant?.id === r.id && <Check className="h-5 w-5 text-primary" />}

                </button>

              ))}

            </div>

          </section>

        )}



        {/* Date & Time Selection */}

        {activeStep === 2 && (

          <div className="space-y-6 animate-slide-up">

            <section className="bg-card rounded-2xl p-6 shadow-soft">

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

                    aria-label={`Select ${d.day}, ${d.month} ${d.date}`} // Added aria-label

                  >

                    <span className="text-xs font-medium opacity-70">{d.day}</span>

                    <span className="text-xl font-bold">{d.date}</span>

                    <span className="text-xs">{d.month}</span>

                  </button>

                ))}

              </div>

            </section>



            <section className="bg-card rounded-2xl p-6 shadow-soft">

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

                    aria-label={`Select time ${time}`} // Added aria-label

                  >

                    {time}

                  </button>

                ))}

              </div>



              <div className="mt-8 flex justify-between">

                <Button variant="ghost" onClick={() => setActiveStep(1)} aria-label="Go back to previous step">Back</Button>

                <Button

                  disabled={!selectedDate || !selectedTime}

                  onClick={() => setActiveStep(3)}

                  className="gap-2"

                  aria-label="Go to next step" // Added aria-label

                >

                  Next Step <ChevronRight className="h-4 w-4" />

                </Button>

              </div>

            </section>

          </div>

        )}



        {/* Guests & Table Selection */}

        {activeStep === 3 && (

          <div className="space-y-6 animate-slide-up">

            <section className="bg-card rounded-2xl p-6 shadow-soft">

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

                    aria-label={`Select ${num} guests`} // Added aria-label

                  >

                    {num}

                  </button>

                ))}

              </div>

            </section>



            <section className="bg-card rounded-2xl p-6 shadow-soft">

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

                <div className="flex items-center gap-2">

                  <span className="text-sm text-muted-foreground mr-2">Special Occasion?</span>

                  <button

                    onClick={() => setIsCelebration(!isCelebration)}

                    className={cn(

                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-muted",

                      isCelebration && "bg-primary"

                    )}

                    aria-label="Toggle special occasion" // Added aria-label

                  >

                    <span className={cn(

                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",

                      isCelebration ? "translate-x-6" : "translate-x-1"

                    )} />

                  </button>

                </div>

              </div>



              {isCelebration && (

                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">

                  {["Birthday", "Anniversary", "Date Night", "Business"].map((opt) => (

                    <Button

                      key={opt}

                      variant={occasion === opt ? "default" : "outline"}

                      size="sm"

                      onClick={() => setOccasion(opt)}

                      className="rounded-full"

                      aria-label={`Select ${opt} as occasion`} // Added aria-label

                    >

                      {opt}

                    </Button>

                  ))}

                </div>

              )}



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

                      aria-label={`Table ${table.id}, ${table.seats} seats, ${isAvailable ? 'available' : 'not available'}`} // Added aria-label

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



            <div className="flex justify-between mt-6">

              <Button variant="ghost" onClick={() => setActiveStep(2)} aria-label="Go back to previous step">Back</Button>

            </div>

          </div>

        )}



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

                <div className="font-semibold">

                  {tables.find(t => t.id === selectedTable)?.type} (T-{selectedTable})

                </div>

              </div>

              {isCelebration && occasion && (

                <div className="bg-primary-foreground/10 rounded-xl p-3">

                  <div className="text-sm opacity-70">Event</div>

                  <div className="font-semibold">{occasion} ✨</div>

                </div>

              )}

            </div>

            <Button

              variant="secondary"

              size="lg"

              className="w-full bg-card text-foreground hover:bg-card/90"

              onClick={handleBooking}

              aria-label="Confirm your booking" // Added aria-label

            >

              Confirm Booking

            </Button>

          </section>

        )}



        {/* Upcoming Bookings */}

        {bookings.length > 0 && (

          <section className="bg-card rounded-2xl p-6 shadow-soft animate-slide-up">

            <h2 className="font-heading text-h3 mb-6">Upcoming Reservations</h2>

            <div className="space-y-4">

              {bookings.map((booking) => (

                <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 transition-colors">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">

                      <Calendar className="h-6 w-6" />

                    </div>

                    <div>

                      <div className="font-bold">{booking.restaurantName}</div>

                      <div className="text-sm text-muted-foreground">

                        {new Date(booking.date).toLocaleDateString()} at {booking.time} • {booking.guests} Guests

                      </div>

                    </div>

                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/50 gap-2"
                    onClick={() => cancelBooking(booking.id)}
                    aria-label={`Cancel booking for ${booking.restaurantName} on ${new Date(booking.date).toLocaleDateString()} at ${booking.time}`}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </Button>

                </div>

              ))}

            </div>

          </section>

        )}

      </div>

    </div>

  );

}
