import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Building2, 
  MapPin, 
  Star, 
  ChevronRight, 
  TrendingUp, 
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { useRestaurantStore } from "@/store/restaurantStore";
import { Button } from "@/components/ui/button";

export default function AdminRestaurantList() {
  const { restaurants } = useRestaurantStore();

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl font-bold text-slate-900 mb-3">Restaurant Management</h1>
          <p className="text-slate-500 font-medium text-lg">Select a restaurant to manage its orders, menu, and operations.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Building2 className="w-6 h-6" />
           </div>
           <div className="text-sm">
              <p className="font-bold text-slate-900 leading-none mb-1">{restaurants.length} Active</p>
              <p className="text-slate-400 font-medium leading-none">Restaurants</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {restaurants.map((restaurant, i) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 overflow-hidden flex flex-col"
          >
            {/* Image Section */}
            <div className="h-44 overflow-hidden relative">
               <img 
                 src={restaurant.image} 
                 alt={restaurant.name} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
               <div className="absolute bottom-4 left-6">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                     <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                     <span className="text-white text-xs font-bold">{restaurant.rating}</span>
                  </div>
               </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex-1">
                 <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                   {restaurant.name}
                 </h3>
                 <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-6">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{restaurant.address}</span>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                       <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          Online
                       </p>
                    </div>
                    <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cuisine</p>
                       <p className="text-sm font-bold text-slate-700 truncate">{restaurant.cuisine}</p>
                    </div>
                 </div>
              </div>

               <Link to={`/admin/${restaurant.id}`} className="block">
                 <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-primary text-white font-bold text-lg shadow-lg shadow-slate-200 transition-all gap-3 group/btn">
                    Manage Restaurant
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                 </Button>
               </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
