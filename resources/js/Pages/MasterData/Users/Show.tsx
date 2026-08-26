import { FormEvent, useState } from "react";

import UserHeader from "@/Components/Users/UserHeader";
import UserInformationCard from "@/Components/Users/UserInformationCard";
import UserVehiclesCard from "@/Components/Users/UserVehiclesCard";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { TUser } from "@/types/types";
import { Head, useForm } from "@inertiajs/react";

interface Props {
    user: TUser;
}

export default function Show({ user }: Props) {
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm({
        role: user?.role,
        is_active: user?.is_active,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        form.put(route("users.update", user.id), {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const cancelEdit = () => {
        setIsEditing(false);

        form.setData({
            role: user.role,
            is_active: user.is_active,
        });

        form.clearErrors();
    };

    return (
        <DashboardLayout
            breadcrumbs={[
                {
                    label: "Pengguna",
                    href: route("users.index"),
                },
                {
                    label: user?.name,
                },
            ]}
        >
            <Head title={user.name} />
            <div className="space-y-6 mx-auto max-w-4xl">
                <UserHeader
                    user={user}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                />

                <div className="gap-6 grid lg:grid-cols-[1fr_1.2fr]">
                    <UserInformationCard
                        user={user}
                        isEditing={isEditing}
                        role={form.data.role}
                        isActive={form.data.is_active}
                        processing={form.processing}
                        onRoleChange={(value) => form.setData("role", value)}
                        onActiveChange={(value) =>
                            form.setData("is_active", value)
                        }
                        onSubmit={submit}
                        onCancel={cancelEdit}
                    />

                    <UserVehiclesCard user={user} />
                </div>
            </div>
        </DashboardLayout>
    );
}
