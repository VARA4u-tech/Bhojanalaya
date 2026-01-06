import { Skeleton } from "@/components/ui/skeleton";

export function OrderCardSkeleton() {
    return (
        <div className="bg-card rounded-xl p-6 shadow-soft space-y-4">
            <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-28" />
            </div>
        </div>
    );
}

export function OrderListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }, (_, i) => (
                <OrderCardSkeleton key={i} />
            ))}
        </div>
    );
}
