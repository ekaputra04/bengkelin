import { Banknote, ChevronDown, Play, SquareCheck, UserX } from 'lucide-react';

import { useIsDialogOpenStore } from '@/stores/use-is-open-dialog-store';
import { TWorkOrder } from '@/types/types';
import { router } from '@inertiajs/react';

import { Button } from '../ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '../ui/dropdown-menu';

export function WorkOrderActions({ booking }: { booking: TWorkOrder }) {
    const actions: {
        label: string;
        icon: React.ReactNode;
        onClick: () => void;
        destructive?: boolean;
    }[] = [];

    const { closeDialog } = useIsDialogOpenStore();

    if (booking.status === "confirmed") {
        actions.push({
            label: "Mulai Pengerjaan",
            icon: <Play className="w-4 h-4" />,
            onClick: () => {
                (router.patch(route("admin.work-orders.update", booking.id), {
                    status: "in_progress",
                }),
                    closeDialog());
            },
        });
        actions.push({
            label: "Tidak Datang",
            icon: <UserX className="w-4 h-4" />,
            onClick: () => {
                router.patch(route("admin.work-orders.update", booking.id), {
                    status: "no_show",
                });
                closeDialog();
            },
            destructive: true,
        });
    } else if (booking.status === "in_progress") {
        actions.push({
            label: "Selesaikan",
            icon: <SquareCheck className="w-4 h-4" />,
            onClick: () => {
                (router.patch(route("admin.work-orders.update", booking.id), {
                    status: "completed",
                }),
                    closeDialog());
            },
        });
    }

    if (booking.status === "completed" && !booking.paid_at) {
        actions.push({
            label: "Bayar Sisa (Cash)",
            icon: <Banknote className="w-4 h-4" />,
            onClick: () => {
                (router.patch(route("admin.work-orders.paid", booking.id)),
                    closeDialog());
            },
        });
    }

    if (actions.length === 0) {
        return <span className="text-muted-foreground text-sm">-</span>;
    }

    if (actions.length === 1) {
        return (
            <Button
                size="sm"
                variant={actions[0].destructive ? "destructive" : "outline"}
                onClick={actions[0].onClick}
            >
                {actions[0].icon}
                {actions[0].label}
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button size="sm" variant="outline">
                    Aksi <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {actions.map((action, i) => (
                    <DropdownMenuItem
                        key={i}
                        className={
                            action.destructive
                                ? "text-destructive focus:text-destructive"
                                : ""
                        }
                        onClick={action.onClick}
                    >
                        {action.icon}
                        {action.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
