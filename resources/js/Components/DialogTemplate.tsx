import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";

import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";

interface DialogTemplateProps {
    title: string;
    description: string;
    className?: string;
    children: React.ReactNode;
    closeMethod?: () => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function DialogTemplate({
    title,
    description,
    className,
    children,
    closeMethod,
    open,
    onOpenChange,
}: DialogTemplateProps) {
    const { isDialogOpen, closeDialog } = useIsDialogOpenStore();
    const isControlled = typeof open === "boolean";
    const dialogOpen = isControlled ? open : isDialogOpen;

    const handleOpenChange = (nextOpen: boolean) => {
        if (onOpenChange) {
            onOpenChange(nextOpen);
        }

        if (!nextOpen && !isControlled) {
            closeDialog();
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            <DialogContent
                showCloseButton={false}
                onKeyDown={(event) => event.stopPropagation()}
                className={cn("max-h-[80vh] overflow-y-auto", className)}
            >
                <DialogHeader>
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2">
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>{description}</DialogDescription>
                        </div>
                        <Button
                            variant={"link"}
                            onClick={() => {
                                if (isControlled) {
                                    onOpenChange?.(false);
                                } else {
                                    closeDialog();
                                }
                            }}
                        >
                            <X />
                        </Button>
                    </div>
                </DialogHeader>
                {children}
                <Button
                    variant={"outline"}
                    onClick={() => {
                        if (isControlled) {
                            onOpenChange?.(false);
                        } else {
                            closeDialog();
                        }

                        if (closeMethod) {
                            closeMethod();
                        }
                    }}
                    size={"sm"}
                >
                    Tutup
                </Button>
            </DialogContent>
        </Dialog>
    );
}
