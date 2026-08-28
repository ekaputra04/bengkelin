import { Plus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { TServiceType, TUser, TVehicle } from "@/types/types";
import { useForm } from "@inertiajs/react";

import { Spinner } from "../ui/spinner";
import AdminScheduleFields from "./AdminScheduleFields";
import AdminServiceTypeSection from "./AdminServiceTypeSection";
import AdminVehicleFields from "./AdminVehicleFields";

interface AdminServiceRequestFormProps {
    customers: TUser[];
    serviceTypes: TServiceType[];
}

export interface AdminFormData {
    user_id: string;
    vehicle_id: string;
    license_plate: string;
    brand: string;
    model: string;
    vehicle_type: string;
    year: string;
    service_type_id: string;
    date: string;
    time: string;
}

export function AdminServiceRequestForm({
    customers,
    serviceTypes,
}: AdminServiceRequestFormProps) {
    const { role } = useAuth();
    const [useExisting, setUseExisting] = useState(false);

    const form = useForm<AdminFormData>({
        user_id: "",
        vehicle_id: "",
        license_plate: "",
        brand: "",
        model: "",
        vehicle_type: "motorcycle",
        year: "",
        service_type_id: "",
        date: "",
        time: "",
    });

    const selectedCustomer =
        customers.find(
            (customer) => customer.id === Number(form.data.user_id),
        ) ?? null;

    const selectedCustomerVehicles = selectedCustomer?.vehicles ?? [];

    useEffect(() => {
        setUseExisting(selectedCustomerVehicles.length > 0);
        form.setData({
            ...form.data,
            vehicle_id: "",
            license_plate: "",
            brand: "",
            model: "",
            vehicle_type: "motorcycle",
            year: "",
        });
    }, [form.data.user_id]);

    const selectedType = serviceTypes.find(
        (type) => type.id === Number(form.data.service_type_id),
    );

    const vehicleTypeItems = [
        { value: "motorcycle", label: "Sepeda Motor" },
        { value: "car", label: "Mobil" },
    ];

    const serviceTypeItems = serviceTypes.map((serviceType) => ({
        value: String(serviceType.id),
        label: `${serviceType.name} (Rp ${Number(serviceType.price).toLocaleString("id-ID")})`,
    }));

    const submit = (event: FormEvent) => {
        event.preventDefault();

        form.transform((data) => ({
            user_id: data.user_id,
            vehicle_id: useExisting ? data.vehicle_id : "",
            vehicle: useExisting
                ? null
                : {
                      license_plate: data.license_plate,
                      brand: data.brand,
                      model: data.model,
                      vehicle_type: data.vehicle_type,
                      year: data.year || null,
                  },
            service_type_id: data.service_type_id,
            requested_start_at:
                data.date && data.time ? `${data.date}T${data.time}` : "",
        }));

        form.post(route(role + ".service-requests.store"));
    };

    const vehicleError = (field: string): string | undefined =>
        (form.errors as Record<string, string>)[`vehicle.${field}`];

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="user_id">Pengguna</Label>

                <Select
                    items={customers.map((customer) => ({
                        value: String(customer.id),
                        label: `${customer.name} - ${customer.email}`,
                    }))}
                    value={form.data.user_id}
                    onValueChange={(value) =>
                        form.setData("user_id", value as string)
                    }
                    disabled={form.processing}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih customer terdaftar" />
                    </SelectTrigger>

                    <SelectContent alignItemWithTrigger={false}>
                        <SelectGroup>
                            {customers.map((customer) => (
                                <SelectItem
                                    key={customer.id}
                                    value={String(customer.id)}
                                >
                                    {customer.name} - {customer.email}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {form.errors.user_id && (
                    <p className="text-destructive text-sm">
                        {form.errors.user_id}
                    </p>
                )}
            </div>

            <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="space-y-1">
                    <Label htmlFor="admin_use_existing">
                        Pakai Kendaraan Terdaftar
                    </Label>

                    <p className="text-muted-foreground text-sm">
                        {selectedCustomer
                            ? selectedCustomerVehicles.length > 0
                                ? "Pilih kendaraan milik customer atau buat kendaraan baru."
                                : "Customer ini belum punya kendaraan terdaftar."
                            : "Pilih customer terlebih dahulu."}
                    </p>
                </div>

                <Switch
                    id="admin_use_existing"
                    checked={useExisting}
                    onCheckedChange={setUseExisting}
                    disabled={
                        !selectedCustomer ||
                        selectedCustomerVehicles.length === 0
                    }
                />
            </div>

            {useExisting ? (
                <div className="space-y-2">
                    <Label htmlFor="vehicle_id">Kendaraan</Label>

                    <Select
                        items={selectedCustomerVehicles.map((vehicle) => ({
                            value: String(vehicle.id),
                            label: `${vehicle.brand} ${vehicle.model} - ${vehicle.license_plate}`,
                        }))}
                        value={form.data.vehicle_id}
                        onValueChange={(value) => {
                            form.setData("vehicle_id", value as string);
                        }}
                        disabled={form.processing || !selectedCustomer}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih kendaraan customer" />
                        </SelectTrigger>

                        <SelectContent alignItemWithTrigger={false}>
                            <SelectGroup>
                                {selectedCustomerVehicles.map((vehicle) => (
                                    <SelectItem
                                        key={vehicle.id}
                                        value={String(vehicle.id)}
                                    >
                                        {vehicle.brand} {vehicle.model} -{" "}
                                        {vehicle.license_plate}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {form.errors.vehicle_id && (
                        <p className="text-destructive text-sm">
                            {form.errors.vehicle_id}
                        </p>
                    )}
                </div>
            ) : (
                <AdminVehicleFields
                    data={form.data}
                    setData={form.setData}
                    processing={form.processing || !selectedCustomer}
                    vehicleError={vehicleError}
                    vehicleTypeItems={vehicleTypeItems}
                />
            )}

            <AdminServiceTypeSection
                form={form}
                serviceTypeItems={serviceTypeItems}
                selectedType={selectedType}
            />

            <AdminScheduleFields form={form} />

            <div className="flex justify-end gap-3">
                <Button type="submit" disabled={form.processing}>
                    {form.processing ? (
                        <>
                            <Spinner /> Memproses
                        </>
                    ) : (
                        <>
                            <Plus /> Ajukan Servis
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
