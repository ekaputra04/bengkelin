import { Pencil, Plus } from "lucide-react";
import { FormEvent } from "react";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { TMechanic } from "@/types/types";
import { useForm } from "@inertiajs/react";

import { Spinner } from "../ui/spinner";

interface MechanicFormProps {
    initialData?: Partial<TMechanic>;
    submitUrl: string;
    method: "post" | "put";
    submitLabel: string;
}

export function MechanicForm({
    initialData,
    submitUrl,
    method,
    submitLabel,
}: MechanicFormProps) {
    const form = useForm<TMechanic>({
        name: initialData?.name ?? "",
        phone: initialData?.phone ?? "",
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
            <div className="space-y-2">
                <Label htmlFor="name">Nama Mekanik</Label>

                <Input
                    id="name"
                    value={form.data.name}
                    onChange={(event) =>
                        form.setData("name", event.target.value)
                    }
                    placeholder="contoh: John Doe"
                    disabled={form.processing}
                />

                {form.errors.name && (
                    <p className="text-destructive text-sm">
                        {form.errors.name}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Durasi Layanan (menit)</Label>

                <Input
                    id="phone"
                    type="number"
                    min={1}
                    value={form.data.phone}
                    onChange={(event) =>
                        form.setData("phone", event.target.value)
                    }
                    disabled={form.processing}
                />

                {form.errors.phone && (
                    <p className="text-destructive text-sm">
                        {form.errors.phone}
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
