import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Order, OrderItem } from "@/store/orderStore";
import { Mail, CheckCircle2, MapPin, Receipt, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface EmailPreviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: Order | null;
    userEmail: string;
}

export function EmailPreviewDialog({
    open,
    onOpenChange,
    order,
    userEmail,
}: EmailPreviewDialogProps) {
    if (!order) return null;

    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.05; // Assuming 5% GST
    const total = subtotal + tax;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-0 overflow-hidden bg-slate-50 border-none shadow-2xl">
                <DialogHeader className="bg-primary p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Mail className="w-5 h-5" />
                        </div>
                        <DialogTitle className="text-xl font-heading">Email Notification Sent!</DialogTitle>
                    </div>
                    <DialogDescription className="text-primary-foreground/80 font-medium">
                        Simulated email sent to: <span className="text-white font-bold">{userEmail}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6">
                    {/* The "Email" Content */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                    >
                        {/* Email Header */}
                        <div className="bg-slate-900 p-6 text-center">
                            <h2 className="text-2xl font-heading font-bold text-white mb-1">BiteBook <span className="text-primary">Direct</span></h2>
                            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Order Confirmation</p>
                        </div>

                        {/* Email Body */}
                        <div className="p-6 space-y-6">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Thanks for your order!</h3>
                                <p className="text-slate-500 text-sm">We've received your order and the kitchen is getting started.</p>
                            </div>

                            <div className="flex items-center justify-between py-3 border-y border-dashed border-slate-200">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Number</p>
                                    <p className="font-bold text-slate-900">{order.orderNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                                    <p className="font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <p className="text-slate-600">
                                            <span className="font-bold text-slate-900">{item.quantity}x</span> {item.name}
                                        </p>
                                        <p className="font-bold text-slate-900">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Calculation */}
                            <div className="pt-4 border-t border-slate-100 space-y-2">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Taxes (GST 5%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-50">
                                    <span>Total Amount</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Footer info */}
                            <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                                <div className="flex items-start gap-2 text-xs text-slate-500">
                                    <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary" />
                                    <span>{order.restaurantName || "Our Restaurant"}</span>
                                </div>
                                {order.tableNumber && (
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Receipt className="w-3.5 h-3.5 text-primary" />
                                        <span>Serving at Table {order.tableNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Email Footer */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-400 mb-4">This is an automated receipt for your student project simulation.</p>
                            <div className="flex justify-center gap-4">
                                <a href="#" className="text-slate-900 text-xs font-bold flex items-center gap-1 hover:text-primary transition-colors">
                                    Help Center <ExternalLink className="w-3 h-3" />
                                </a>
                                <a href="#" className="text-slate-900 text-xs font-bold flex items-center gap-1 hover:text-primary transition-colors">
                                    Privacy Policy <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
