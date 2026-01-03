import { cn } from "@/lib/utils";

type OrderStatus = "waiting" | "confirmed" | "preparing" | "ready" | "served" | "completed" | "cancelled";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  waiting: {
    label: "Waiting",
    className: "status-waiting",
  },
  confirmed: {
    label: "Confirmed",
    className: "status-confirmed",
  },
  preparing: {
    label: "Preparing",
    className: "status-preparing",
  },
  ready: {
    label: "Ready",
    className: "status-ready",
  },
  served: {
    label: "Served",
    className: "status-ready",
  },
  completed: {
    label: "Completed",
    className: "status-ready",
  },
  cancelled: {
    label: "Cancelled",
    className: "status-cancelled",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn("status-badge", config.className, className)}>
      {config.label}
    </span>
  );
}

export type { OrderStatus };
