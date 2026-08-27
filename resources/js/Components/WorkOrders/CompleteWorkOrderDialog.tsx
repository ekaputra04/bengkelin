import { FormEvent } from "react";
import { SquareCheck } from "lucide-react";

import DialogTemplate from "@/Components/DialogTemplate";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";

interface CompleteWorkOrderDialogProps {
    open: boolean;
    endTime: string;
    isSubmitting: boolean;
    onEndTimeChange: (value: string) => void;
    onOpenChange: (open: boolean) => void;
    onSubmit: (event: FormEvent) => void;
}

export default function CompleteWorkOrderDialog({
    open,
    endTime,
    isSubmitting,
    onEndTimeChange,
    onOpenChange,
    onSubmit,
}: CompleteWorkOrderDialogProps) {
    return (
        <DialogTemplate
            open={open}
            onOpenChange={onOpenChange}
            title="Selesaikan Booking"
            description="Atur jam selesai aktual sebelum order ditandai selesai."
            className="sm:max-w-md"
        >
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="end_time">Jam Selesai</Label>

                    <Input
                        id="end_time"
                        type="time"
                        value={endTime}
                        onChange={(event) => onEndTimeChange(event.target.value)}
                        required
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? (
                            <Spinner />
                        ) : (
                            <SquareCheck className="w-4 h-4" />
                        )}
                        Simpan & Selesaikan
                    </Button>
                </div>
            </form>
        </DialogTemplate>
    );
}
