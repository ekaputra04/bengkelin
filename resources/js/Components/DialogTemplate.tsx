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
}

export default function DialogTemplate({
    title,
    description,
    className,
    children,
    closeMethod,
}: DialogTemplateProps) {
    const { isDialogOpen, closeDialog } = useIsDialogOpenStore();

    return (
        <Dialog open={isDialogOpen}>
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
                                closeDialog();
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
                        closeDialog();
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
