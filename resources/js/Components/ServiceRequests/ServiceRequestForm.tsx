import { Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { useAuth } from '@/hooks/use-auth';
import { formatLocalDate } from '@/lib/utils';
import { TServiceType, TVehicle } from '@/types/types';
import { useForm } from '@inertiajs/react';

import { Spinner } from '../ui/spinner';

interface ServiceRequestFormProps {
    vehicles: TVehicle[];
    serviceTypes: TServiceType[];
}

interface FormData {
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

export function ServiceRequestForm({
    vehicles,
    serviceTypes,
}: ServiceRequestFormProps) {
    const [useExisting, setUseExisting] = useState(vehicles.length > 0);
    const { role } = useAuth();

    const form = useForm<FormData>({
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

    const selectedType = serviceTypes.find(
        (type) => type.id === Number(form.data.service_type_id),
    );

    const vehicleItems = vehicles.map((vehicle) => ({
        value: String(vehicle.id),
        label: `${vehicle.brand} ${vehicle.model} — ${vehicle.license_plate}`,
    }));

    const vehicleTypeItems = [
        { value: "motorcycle", label: "Sepeda Motor" },
        { value: "car", label: "Mobil" },
    ];

    const serviceTypeItems = serviceTypes.map((serviceType) => ({
        value: String(serviceType.id),
        label: `${serviceType.name} (Rp ${Number(
            serviceType.price,
        ).toLocaleString("id-ID")})`,
    }));

    const submit = (event: FormEvent) => {
        event.preventDefault();

        form.transform((data) => ({
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
            <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="space-y-1">
                    <Label htmlFor="use_existing">
                        Pakai Kendaraan Terdaftar
                    </Label>

                    <p className="text-muted-foreground text-sm">
                        {vehicles.length > 0
                            ? "Pilih salah satu kendaraan Anda."
                            : "Anda belum punya kendaraan terdaftar."}
                    </p>
                </div>

                <Switch
                    id="use_existing"
                    checked={useExisting}
                    onCheckedChange={setUseExisting}
                    disabled={vehicles.length === 0}
                />
            </div>

            {useExisting ? (
                <div className="space-y-2">
                    <Label htmlFor="vehicle_id">Kendaraan</Label>

                    <Select
                        items={vehicleItems}
                        value={form.data.vehicle_id}
                        onValueChange={(value) => {
                            form.setData("vehicle_id", value as string);
                        }}
                        disabled={form.processing}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih kendaraan" />
                        </SelectTrigger>

                        <SelectContent alignItemWithTrigger={false}>
                            <SelectGroup>
                                {vehicles.map((vehicle) => (
                                    <SelectItem
                                        key={vehicle.id}
                                        value={String(vehicle.id)}
                                    >
                                        {vehicle.brand} {vehicle.model} —{" "}
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
                <div className="gap-6 grid md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="license_plate">Plat Nomor</Label>

                        <Input
                            id="license_plate"
                            value={form.data.license_plate}
                            onChange={(event) =>
                                form.setData(
                                    "license_plate",
                                    event.target.value,
                                )
                            }
                            placeholder="contoh: B1234XYZ"
                            disabled={form.processing}
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
                            value={form.data.brand}
                            onChange={(event) =>
                                form.setData("brand", event.target.value)
                            }
                            placeholder="contoh: Honda"
                            disabled={form.processing}
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
                            value={form.data.model}
                            onChange={(event) =>
                                form.setData("model", event.target.value)
                            }
                            placeholder="contoh: Beat 110"
                            disabled={form.processing}
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
                            value={form.data.vehicle_type}
                            onValueChange={(value) => {
                                form.setData("vehicle_type", value as string);
                            }}
                            disabled={form.processing}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih jenis kendaraan" />
                            </SelectTrigger>

                            <SelectContent>
                                {vehicleTypeItems.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value}
                                    >
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
                            value={form.data.year}
                            onChange={(event) =>
                                form.setData("year", event.target.value)
                            }
                            placeholder="contoh: 2023"
                            disabled={form.processing}
                        />

                        {vehicleError("year") && (
                            <p className="text-destructive text-sm">
                                {vehicleError("year")}
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="service_type_id">Jenis Layanan</Label>

                <Select
                    items={serviceTypeItems}
                    value={form.data.service_type_id || undefined}
                    onValueChange={(value) => {
                        form.setData("service_type_id", value as string);
                    }}
                    disabled={form.processing}
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
                                {Number(selectedType.price).toLocaleString(
                                    "id-ID",
                                )}
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

                    {(form.errors as Record<string, string>)
                        .requested_start_at && (
                        <p className="text-destructive text-sm">
                            {
                                (form.errors as Record<string, string>)
                                    .requested_start_at
                            }
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
