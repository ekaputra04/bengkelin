import { TServiceType } from "@/types/types";

import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { AdminSharedFormShape } from "./AdminScheduleFields";

interface Props {
    form: AdminSharedFormShape;
    serviceTypeItems: { value: string; label: string }[];
    selectedType?: TServiceType;
    disabled?: boolean;
}
export default function AdminServiceTypeSection({
    form,
    serviceTypeItems,
    selectedType,
    disabled,
}: Props) {
    return (
        <div className="space-y-2">
            <Label htmlFor="service_type_id">Jenis Layanan</Label>

            <Select
                items={serviceTypeItems}
                value={form.data.service_type_id || undefined}
                onValueChange={(value) => {
                    form.setData("service_type_id", value as string);
                }}
                disabled={form.processing || disabled}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih layanan" />
                </SelectTrigger>

                <SelectContent>
                    {serviceTypeItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {form.errors.service_type_id && (
                <p className="text-destructive text-sm">
                    {form.errors.service_type_id}
                </p>
            )}

            {selectedType && (
                <div className="gap-4 grid grid-cols-3 mt-3 p-4 border rounded-lg text-sm">
                    <div>
                        <p className="text-muted-foreground">Durasi</p>
                        <p className="font-medium">
                            {selectedType.duration_minutes} menit
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Harga Total</p>
                        <p className="font-medium">
                            Rp{" "}
                            {Number(selectedType.price).toLocaleString("id-ID")}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">
                            DP untuk kunci jadwal
                        </p>
                        <p className="font-medium">
                            Rp{" "}
                            {Number(selectedType.dp_amount).toLocaleString(
                                "id-ID",
                            )}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
