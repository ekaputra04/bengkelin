import { ArrowLeft, Pencil } from "lucide-react";
import { FormEvent, useState } from "react";

import { ServiceTypeStatusBadge } from "@/Components/ServiceTypes/ServiceTypeStatusBadge";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Spinner } from "@/Components/ui/spinner";
import { Switch } from "@/Components/ui/switch";
import { UserRoleBadge } from "@/Components/Users/UserRoleBadge";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { TUser } from "@/types/types";
import { Head, Link, useForm } from "@inertiajs/react";

interface Props {
    user: TUser;
}

const roleOptions = [
    { value: "customer", label: "Pelanggan" },
    { value: "admin", label: "Admin" },
    { value: "mechanic", label: "Mekanik" },
];

export default function Show({ user }: Props) {
    const form = useForm({
        role: user.role,
        is_active: user.is_active,
    });

    const [isEditing, setIsEditing] = useState(false);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(route("users.update", user.id), {
            onSuccess: () => setIsEditing(false),
        });
    };

    return (
        <DashboardLayout
            breadcrumbs={[
                {
                    label: "Pengguna",
                    href: route("users.index"),
                },
                { label: user.name },
            ]}
        >
            <Head title={user.name} />

            <div className="space-y-6 mx-auto max-w-3xl">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href={route("users.index")}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft />
                            </Button>
                        </Link>

                        <div>
                            <h1 className="font-semibold text-2xl">
                                {user.name}
                            </h1>

                            <p className="text-muted-foreground text-sm">
                                Detail pengguna
                            </p>
                        </div>
                    </div>

                    {!isEditing && (
                        <Button onClick={() => setIsEditing(true)}>
                            <Pencil className="mr-2 w-4 h-4" />
                            Edit
                        </Button>
                    )}
                </div>

                <div className="bg-card border rounded-xl">
                    <div className="space-y-6 p-6">
                        <div>
                            <p className="text-muted-foreground text-sm">
                                Nama
                            </p>

                            <p className="mt-1 font-medium">{user.name}</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground text-sm">
                                Email
                            </p>

                            <p className="mt-1 font-medium">{user.email}</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground text-sm">
                                Role
                            </p>

                            {isEditing ? (
                                <Select
                                    value={form.data.role}
                                    onValueChange={(value) =>
                                        form.setData("role", value as any)
                                    }
                                >
                                    <SelectTrigger className="mt-1 w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roleOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="mt-1">
                                    <UserRoleBadge role={user.role} />
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-muted-foreground text-sm">
                                Status
                            </p>

                            {isEditing ? (
                                <div className="flex items-center gap-3 mt-1">
                                    <Switch
                                        checked={form.data.is_active}
                                        onCheckedChange={(checked) =>
                                            form.setData("is_active", checked)
                                        }
                                        disabled={form.processing}
                                    />
                                    <span className="text-sm">
                                        {form.data.is_active
                                            ? "Aktif"
                                            : "Tidak Aktif"}
                                    </span>
                                </div>
                            ) : (
                                <div className="mt-1">
                                    <ServiceTypeStatusBadge
                                        isActive={user.is_active}
                                    />
                                </div>
                            )}
                        </div>

                        {isEditing && (
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                        form.reset();
                                    }}
                                    disabled={form.processing}
                                >
                                    Batal
                                </Button>

                                <Button
                                    onClick={submit}
                                    disabled={form.processing}
                                >
                                    {form.processing ? (
                                        <>
                                            <Spinner /> Simpan
                                        </>
                                    ) : (
                                        "Simpan"
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
