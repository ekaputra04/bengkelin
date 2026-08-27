import { Play } from 'lucide-react';
import { FormEvent } from 'react';

import { Button } from '../ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface StartWorkOrderDialogProps {
    open: boolean;
    startTime: string;
    onStartTimeChange: (value: string) => void;
    onOpenChange: (open: boolean) => void;
    onSubmit: (event: FormEvent) => void;
}

export default function StartWorkOrderDialog({
    open,
    startTime,
    onStartTimeChange,
    onOpenChange,
    onSubmit,
}: StartWorkOrderDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Mulai Servis</DialogTitle>

                    <DialogDescription>
                        Atur jam mulai aktual sebelum pekerjaan dimulai.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="start_at">Jam Mulai</Label>

                        <Input
                            id="start_at"
                            type="time"
                            value={startTime}
                            onChange={(event) =>
                                onStartTimeChange(event.target.value)
                            }
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>

                        <Button type="submit">
                            <Play className="w-4 h-4" />
                            Mulai Pengerjaan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
