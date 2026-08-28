import { formatLocalDate } from "@/lib/utils";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

export type AdminSharedFormShape = {
    data: {
        service_type_id: string;
        date: string;
        time: string;
    };
    setData: (key: "service_type_id" | "date" | "time", value: string) => void;
    errors: Record<string, string>;
    processing: boolean;
};

export default function AdminScheduleFields({
    form,
}: {
    form: AdminSharedFormShape;
}) {
    return (
        <div className="gap-6 grid md:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="date">Tanggal Servis</Label>

                <Input
                    id="date"
                    type="date"
                    min={formatLocalDate()}
                    value={form.data.date}
                    onChange={(event) =>
                        form.setData("date", event.target.value)
                    }
                    disabled={form.processing}
                />

                {form.errors.requested_start_at && (
                    <p className="text-destructive text-sm">
                        {form.errors.requested_start_at}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="time">Jam Servis</Label>

                <Input
                    id="time"
                    type="time"
                    value={form.data.time}
                    onChange={(event) =>
                        form.setData("time", event.target.value)
                    }
                    disabled={form.processing}
                />
            </div>
        </div>
    );
}
