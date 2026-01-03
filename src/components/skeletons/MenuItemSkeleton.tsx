import { Skeleton } from "@/components/ui/skeleton";

export function MenuItemSkeleton() {
    return (
        <div className="bg-card rounded-2xl overflow-hidden shadow-soft">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-5 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex items-center justify-between pt-3">
                    <Skeleton className="h-7 w-20" />
                    <Skeleton className="h-9 w-28 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export function MenuGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }, (_, i) => (
                <MenuItemSkeleton key={i} />
            ))}
        </div>
    );
}
