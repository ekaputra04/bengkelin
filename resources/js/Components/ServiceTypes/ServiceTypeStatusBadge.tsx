import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";

interface ServiceTypeStatusBadgeProps {
    isActive: boolean;
}

export function ServiceTypeStatusBadge({
    isActive,
}: ServiceTypeStatusBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={cn(
                isActive
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-600",
            )}
        >
            {isActive ? "Aktif" : "Tidak Aktif"}
        </Badge>
    );
}
