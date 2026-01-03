import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

interface CancelOrderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    orderTotal: number;
    refundAmount: number;
}

export function CancelOrderDialog({
    open,
    onOpenChange,
    onConfirm,
    orderTotal,
    refundAmount,
}: CancelOrderDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                        </div>
                        <AlertDialogTitle className="text-xl">Cancel Order?</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="space-y-3 pt-2">
                        <p>
                            Are you sure you want to cancel this order? This action cannot be
                            undone.
                        </p>

                        <div className="bg-muted rounded-lg p-4 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Order Total:</span>
                                <span className="font-medium">${orderTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Refund Amount (50%):</span>
                                <span className="font-bold text-primary">${refundAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="text-xs text-muted-foreground border-l-2 border-primary/50 pl-3">
                            <strong>Cancellation Policy:</strong> Orders can be cancelled before
                            preparation begins. You'll receive a 50% refund of the order total.
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Keep Order</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Yes, Cancel Order
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
