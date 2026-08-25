"use client";

import { Badge } from "@/Components/ui/badge";

const roleLabels: Record<string, string> = {
    customer: "Pelanggan",
    admin: "Admin",
    mechanic: "Mekanik",
};

export function UserRoleBadge({ role }: { role: string }) {
    const color =
        role === "admin"
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : role === "mechanic"
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-green-200 bg-green-50 text-green-700";

    return (
        <Badge variant="outline" className={color}>
            {roleLabels[role] ?? role}
        </Badge>
    );
}
