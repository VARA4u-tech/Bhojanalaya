import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Users, 
  Search, 
  ChevronRight, 
  Phone, 
  Mail,
  CheckCircle2,
  XCircle,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  customer: string;
  guests: number;
  date: string;
  time: string;
  table: string;
  status: "confirmed" | "completed" | "cancelled" | "pending";
}

const mockBookings: Booking[] = [
  { id: "BK-101", customer: "Suresh Raina", guests: 4, date: "2024-03-20", time: "07:30 PM", table: "T-14", status: "confirmed" },
  { id: "BK-102", customer: "M.S. Dhoni", guests: 8, date: "2024-03-20", time: "08:00 PM", table: "T-VIP", status: "confirmed" },
  { id: "BK-103", customer: "Virat Kohli", guests: 2, date: "2024-03-20", time: "08:30 PM", table: "T-02", status: "pending" },
  { id: "BK-104", customer: "Jasprit Bumrah", guests: 4, date: "2024-03-21", time: "01:00 PM", table: "T-05", status: "confirmed" },
];

export default function AdminBookings() {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Reservations</h1>
          <p className="text-slate-500 font-medium">Monitor and manage all table bookings for Bhojanālaya.</p>
        </div>
        <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm flex">
           {["upcoming", "completed", "cancelled"].map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                  activeTab === tab 
                    ? "bg-primary text-white shadow-md shadow-primary/10" 
                    : "text-slate-400 hover:text-slate-900"
                )}
             >
                {tab}
             </button>
           ))}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Booking Cards */}
         <div className="lg:col-span-2 space-y-4">
            <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search by customer name or ID..." 
                 className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium shadow-sm"
               />
            </div>

            {mockBookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-primary/20 transition-all flex flex-col sm:flex-row items-center gap-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20">
                   <Calendar className="w-8 h-8 text-secondary" />
                </div>

                <div className="flex-1 text-center sm:text-left">
                   <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                      <h4 className="font-heading text-lg font-bold text-slate-900">{booking.customer}</h4>
                      <span className={cn(
                        "px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border mx-auto sm:mx-0",
                        booking.status === "confirmed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                      )}>
                        {booking.status}
                      </span>
                   </div>
                   <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-slate-400 font-medium tracking-tight">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{booking.time}</span>
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{booking.guests} Guests</span>
                      <span className="flex items-center gap-1.5 font-bold text-primary">{booking.table}</span>
                   </div>
                </div>

                <div className="flex items-center gap-2 pt-4 sm:pt-0 border-t sm:border-none border-slate-50 w-full sm:w-auto">
                   <Button variant="outline" size="sm" className="flex-1 sm:flex-none rounded-xl border-slate-200 font-bold hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Arrived
                   </Button>
                   <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100">
                      <MoreHorizontal className="w-5 h-5 text-slate-400" />
                   </Button>
                </div>
              </motion.div>
            ))}
         </div>

         {/* Side Info */}
         <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                  <Calendar className="w-24 h-24" />
               </div>
               <div className="relative z-10">
                  <h3 className="font-heading text-xl font-bold mb-6">Daily Summary</h3>
                  <div className="space-y-6">
                     {[
                       { label: "Total Bookings", value: 12, icon: Calendar },
                       { label: "Total Guests", value: 48, icon: Users },
                       { label: "Tables Occupied", value: "85%", icon: Clock },
                     ].map((s) => (
                       <div key={s.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <s.icon className="w-5 h-5" />
                             </div>
                             <span className="text-sm font-medium text-white/70">{s.label}</span>
                          </div>
                          <span className="font-bold text-lg">{s.value}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
               <h4 className="font-heading text-lg font-bold text-slate-900 mb-4">Quick Links</h4>
               <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="rounded-xl h-20 flex flex-col gap-2 font-bold border-slate-100 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all">
                     <Users className="w-5 h-5" />
                     Customers
                  </Button>
                  <Button variant="outline" className="rounded-xl h-20 flex flex-col gap-2 font-bold border-slate-100 hover:bg-secondary/5 hover:text-secondary hover:border-secondary/20 transition-all">
                     <Clock className="w-5 h-5" />
                     Shifts
                  </Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
