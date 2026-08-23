import { Pencil, Plus } from "lucide-react";
import { FormEvent } from "react";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { Textarea } from "@/Components/ui/textarea";
import { TServiceType } from "@/types/types";
import { useForm } from "@inertiajs/react";

import { Spinner } from "../ui/spinner";

interface ServiceTypeFormProps {
    initialData?: Partial<TServiceType>;
    submitUrl: string;
    method: "post" | "put";
    submitLabel: string;
}

export function ServiceTypeForm({
    initialData,
    submitUrl,
    method,
    submitLabel,
}: ServiceTypeFormProps) {
    const form = useForm<TServiceType>({
        name: initialData?.name ?? "",
        description: initialData?.description ?? "",
        duration_minutes: initialData?.duration_minutes ?? 30,
        price: initialData?.price ?? 0,
        dp_amount: initialData?.dp_amount ?? 0,
        is_active: initialData?.is_active ?? true,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (method === "post") {
            form.post(submitUrl);
        } else {
            form.put(submitUrl);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="gap-6 grid md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Layanan</Label>

                    <Input
                        id="name"
                        value={form.data.name}
                        onChange={(event) =>
                            form.setData("name", event.target.value)
                        }
                        placeholder="contoh: ganti oli"
                        disabled={form.processing}
                    />

                    {form.errors.name && (
                        <p className="text-destructive text-sm">
                            {form.errors.name}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="duration_minutes">
                        Durasi Layanan (menit)
                    </Label>

                    <Input
                        id="duration_minutes"
                        type="number"
                        min={1}
                        value={form.data.duration_minutes}
                        onChange={(event) =>
                            form.setData(
                                "duration_minutes",
                                Number(event.target.value),
                            )
                        }
                        disabled={form.processing}
                    />

                    {form.errors.duration_minutes && (
                        <p className="text-destructive text-sm">
                            {form.errors.duration_minutes}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">Harga Layanan (Rp.)</Label>

                    <Input
                        id="price"
                        type="number"
                        min={0}
                        value={form.data.price}
                        onChange={(event) =>
                            form.setData("price", Number(event.target.value))
                        }
                        disabled={form.processing}
                    />

                    {form.errors.price && (
                        <p className="text-destructive text-sm">
                            {form.errors.price}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="dp_amount">Pembayaran DP (Rp.)</Label>

                    <Input
                        id="dp_amount"
                        type="number"
                        min={0}
                        value={form.data.dp_amount}
                        onChange={(event) =>
                            form.setData(
                                "dp_amount",
                                Number(event.target.value),
                            )
                        }
                        disabled={form.processing}
                    />

                    {form.errors.dp_amount && (
                        <p className="text-destructive text-sm">
                            {form.errors.dp_amount}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>

                <Textarea
                    id="description"
                    value={form.data.description}
                    onChange={(event) =>
                        form.setData("description", event.target.value)
                    }
                    placeholder="Describe the service..."
                    rows={4}
                    disabled={form.processing}
                />

                {form.errors.description && (
                    <p className="text-destructive text-sm">
                        {form.errors.description}
                    </p>
                )}
            </div>

            <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="space-y-1">
                    <Label htmlFor="is_active">Status Aktif</Label>

                    <p className="text-muted-foreground text-sm">
                        Tentukan apakah layanan servis ini aktif dan dapat
                        dipilih oleh pelanggan.
                    </p>
                </div>

                <Switch
                    id="is_active"
                    checked={form.data.is_active}
                    onCheckedChange={(checked) =>
                        form.setData("is_active", checked)
                    }
                    disabled={form.processing}
                />
            </div>

            <div className="flex justify-end gap-3">
                <Button type="submit" disabled={form.processing}>
                    {form.processing ? (
                        <>
                            <Spinner /> Proses
                        </>
                    ) : (
                        <>
                            {method === "post" ? <Plus /> : <Pencil />}{" "}
                            {submitLabel}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
