import { useState } from "react";

import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { router } from "@inertiajs/react";

interface DeleteServiceTypeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    serviceTypeId: number | null;
    serviceTypeName: string | null;
}

export function DeleteServiceTypeDialog({
    open,
    onOpenChange,
    serviceTypeId,
    serviceTypeName,
}: DeleteServiceTypeDialogProps) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        if (!serviceTypeId) {
            return;
        }

        setProcessing(true);

        router.delete(route("service-types.destroy", serviceTypeId), {
            preserveScroll: true,

            onSuccess: () => {
                onOpenChange(false);
            },

            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!processing) {
                    onOpenChange(value);
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Service Type</DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-medium text-foreground">
                            {serviceTypeName}
                        </span>
                        ?
                        <br />
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button
                        type="button"
                        variant="destructive"
                        disabled={processing}
                        onClick={handleDelete}
                    >
                        {processing ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
