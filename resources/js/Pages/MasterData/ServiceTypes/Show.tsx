import { ArrowLeft, Pencil } from "lucide-react";

import { ServiceTypeStatusBadge } from "@/Components/ServiceTypes/ServiceTypeStatusBadge";
import { Button } from "@/Components/ui/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { formatCurrency } from "@/lib/utils";
import { TServiceType } from "@/types/types";
import { Head, Link } from "@inertiajs/react";

interface Props {
    serviceType: TServiceType;
}

export default function Show({ serviceType }: Props) {
    return (
        <DashboardLayout
            breadcrumbs={[
                {
                    label: "Jenis Layanan",
                    href: route("admin.service-types.index"),
                },
                { label: serviceType.name },
            ]}
        >
            <Head title={serviceType.name} />

            <div className="space-y-6 mx-auto max-w-3xl">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href={route("admin.service-types.index")}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft />
                            </Button>
                        </Link>

                        <div>
                            <h1 className="font-semibold text-2xl">
                                {serviceType.name}
                            </h1>

                            <p className="text-muted-foreground text-sm">
                                Detail layanan
                            </p>
                        </div>
                    </div>

                    <Link
                        href={route("admin.service-types.edit", serviceType.id)}
                    >
                        <Button>
                            <Pencil className="mr-2 w-4 h-4" />
                            Edit
                        </Button>
                    </Link>
                </div>

                <div className="bg-card border rounded-xl">
                    <div className="grid md:grid-cols-2 md:divide-x divide-y md:divide-y-0">
                        <div className="space-y-6 p-6">
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Nama Layanan
                                </p>

                                <p className="mt-1 font-medium">
                                    {serviceType.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Durasi Layanan
                                </p>

                                <p className="mt-1 font-medium">
                                    {serviceType.duration_minutes} minutes
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Status
                                </p>

                                <div className="mt-1">
                                    <ServiceTypeStatusBadge
                                        isActive={serviceType.is_active}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 p-6">
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Biaya Layanan
                                </p>

                                <p className="mt-1 font-semibold text-lg">
                                    {formatCurrency(serviceType.price)}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Uang Muka
                                </p>

                                <p className="mt-1 font-semibold text-lg">
                                    {formatCurrency(serviceType.dp_amount)}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Deskripsi
                                </p>

                                <p className="mt-1 text-sm">
                                    {serviceType.description ||
                                        "No description."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
