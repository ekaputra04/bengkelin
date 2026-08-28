import { useForm } from "@inertiajs/react";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { AdminFormData } from "./AdminServiceRequestForm";

type AdminVehicleFieldsProps = {
    data: AdminFormData;
    setData: ReturnType<typeof useForm<AdminFormData>>["setData"];
    processing: boolean;
    vehicleError: (field: string) => string | undefined;
    vehicleTypeItems: { value: string; label: string }[];
};

export default function AdminVehicleFields({
    data,
    setData,
    processing,
    vehicleError,
    vehicleTypeItems,
}: AdminVehicleFieldsProps) {
    return (
        <div className="gap-6 grid md:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="license_plate">Plat Nomor</Label>

                <Input
                    id="license_plate"
                    value={data.license_plate}
                    onChange={(event) =>
                        setData("license_plate", event.target.value)
                    }
                    placeholder="contoh: B1234XYZ"
                    disabled={processing}
                />

                {vehicleError("license_plate") && (
                    <p className="text-destructive text-sm">
                        {vehicleError("license_plate")}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="brand">Merek</Label>

                <Input
                    id="brand"
                    value={data.brand}
                    onChange={(event) => setData("brand", event.target.value)}
                    placeholder="contoh: Honda"
                    disabled={processing}
                />

                {vehicleError("brand") && (
                    <p className="text-destructive text-sm">
                        {vehicleError("brand")}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="model">Model</Label>

                <Input
                    id="model"
                    value={data.model}
                    onChange={(event) => setData("model", event.target.value)}
                    placeholder="contoh: Beat 110"
                    disabled={processing}
                />

                {vehicleError("model") && (
                    <p className="text-destructive text-sm">
                        {vehicleError("model")}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="vehicle_type">Jenis Kendaraan</Label>

                <Select
                    items={vehicleTypeItems}
                    value={data.vehicle_type}
                    onValueChange={(value) => {
                        setData("vehicle_type", value as string);
                    }}
                    disabled={processing}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih jenis kendaraan" />
                    </SelectTrigger>

                    <SelectContent>
                        {vehicleTypeItems.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {vehicleError("vehicle_type") && (
                    <p className="text-destructive text-sm">
                        {vehicleError("vehicle_type")}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="year">Tahun (opsional)</Label>

                <Input
                    id="year"
                    type="number"
                    min={1980}
                    max={new Date().getFullYear() + 1}
                    value={data.year}
                    onChange={(event) => setData("year", event.target.value)}
                    placeholder="contoh: 2023"
                    disabled={processing}
                />

                {vehicleError("year") && (
                    <p className="text-destructive text-sm">
                        {vehicleError("year")}
                    </p>
                )}
            </div>
        </div>
    );
}
