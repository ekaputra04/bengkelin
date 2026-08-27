import { Banknote, ChevronDown, Play, SquareCheck, UserX } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

import { formatTimeFieldValue } from '@/lib/utils';
import { useIsDialogOpenStore } from '@/stores/use-is-open-dialog-store';
import { TWorkOrder } from '@/types/types';
import { router } from '@inertiajs/react';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '../ui/dropdown-menu';
import CompleteWorkOrderDialog from './CompleteWorkOrderDialog';
import StartWorkOrderDialog from './StartWorkOrderDialog';

interface WorkOrderActionItem {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    destructive?: boolean;
}

export function WorkOrderActions({ booking }: { booking: TWorkOrder }) {
    const [isStartDialogOpen, setIsStartDialogOpen] = useState(false);

    const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);

    const [startTime, setStartTime] = useState(
        formatTimeFieldValue(booking.start_at),
    );

    const [endTime, setEndTime] = useState(
        formatTimeFieldValue(booking.end_at),
    );

    const { closeDialog } = useIsDialogOpenStore();
    const [isSubmittingComplete, setIsSubmittingComplete] = useState(false);

    useEffect(() => {
        setStartTime(formatTimeFieldValue(booking.start_at));

        setEndTime(formatTimeFieldValue(booking.end_at));
    }, [booking.start_at, booking.end_at]);

    const handleStartWork = (event: FormEvent) => {
        event.preventDefault();

        router.patch(
            route("admin.work-orders.update", booking.id),
            {
                status: "in_progress",
                start_at: startTime,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    setIsStartDialogOpen(false);
                    closeDialog();
                },
            },
        );
    };

    const handleCompleteWork = (event: FormEvent) => {
        event.preventDefault();
        setIsSubmittingComplete(true);

        router.patch(
            route("admin.work-orders.update", booking.id),
            {
                status: "completed",
                end_time: endTime,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    setIsCompleteDialogOpen(false);
                    setIsSubmittingComplete(false);
                    closeDialog();
                },
                onError: () => {
                    setIsSubmittingComplete(false);
                },
                onFinish: () => {
                    setIsSubmittingComplete(false);
                },
            },
        );
    };

    const handleNoShow = () => {
        router.patch(
            route("admin.work-orders.update", booking.id),
            {
                status: "no_show",
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    closeDialog();
                },
            },
        );
    };

    const handleMarkPaid = () => {
        router.patch(
            route("admin.work-orders.paid", booking.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    closeDialog();
                },
            },
        );
    };

    const actions: WorkOrderActionItem[] = [];

    if (booking.status === "confirmed") {
        actions.push({
            label: "Mulai Pengerjaan",
            icon: <Play className="w-4 h-4" />,
            onClick: () => {
                setStartTime(formatTimeFieldValue(booking.start_at));
                setIsStartDialogOpen(true);
            },
        });

        actions.push({
            label: "Tidak Datang",
            icon: <UserX className="w-4 h-4" />,
            onClick: handleNoShow,
            destructive: true,
        });
    }

    if (booking.status === "in_progress") {
        actions.push({
            label: "Selesaikan",
            icon: <SquareCheck className="w-4 h-4" />,
            onClick: () => {
                setEndTime(formatTimeFieldValue(booking.end_at));

                setIsCompleteDialogOpen(true);
            },
        });
    }

    if (booking.status === "completed") {
        actions.push({
            label: "Bayar Sisa (Cash)",
            icon: <Banknote className="w-4 h-4" />,
            onClick: handleMarkPaid,
        });
    }

    if ((booking.status as string) === "fully_paid") {
        return (
            <Badge className="bg-green-50 border-green-50 text-green-600">
                Orderan sudah selesai dan lunas
            </Badge>
        );
    }

    if (actions.length === 0) {
        return <span className="text-muted-foreground text-sm">-</span>;
    }

    return (
        <>
            {actions.length === 1 ? (
                <Button
                    size="sm"
                    variant={actions[0].destructive ? "destructive" : "outline"}
                    onClick={actions[0].onClick}
                >
                    {actions[0].icon}
                    {actions[0].label}
                </Button>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button size="sm" variant="outline">
                            Aksi
                            <ChevronDown className="ml-1 w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        {actions.map((action) => (
                            <DropdownMenuItem
                                key={action.label}
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
            )}

            <StartWorkOrderDialog
                open={isStartDialogOpen}
                startTime={startTime}
                onStartTimeChange={setStartTime}
                onOpenChange={setIsStartDialogOpen}
                onSubmit={handleStartWork}
            />

            <CompleteWorkOrderDialog
                open={isCompleteDialogOpen}
                endTime={endTime}
                isSubmitting={isSubmittingComplete}
                onEndTimeChange={setEndTime}
                onOpenChange={setIsCompleteDialogOpen}
                onSubmit={handleCompleteWork}
            />
        </>
    );
}
