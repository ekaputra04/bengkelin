import { ArrowLeft, Pencil } from "lucide-react";

import { ServiceTypeStatusBadge } from "@/Components/ServiceTypes/ServiceTypeStatusBadge";
import { Button } from "@/Components/ui/button";
import { Head, Link } from "@inertiajs/react";

interface ServiceType {
    id: number;
    name: string;
    description: string | null;
    duration_minutes: number;
    price: string;
    dp_amount: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    serviceType: ServiceType;
}

export default function Show({ serviceType }: Props) {
    return (
        <div>
            <Head title={serviceType.name} />

            <div className="space-y-6 mx-auto p-6 max-w-3xl">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href={route("service-types.index")}>
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

                    <Link href={route("service-types.edit", serviceType.id)}>
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
                                    Service Name
                                </p>

                                <p className="mt-1 font-medium">
                                    {serviceType.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Duration
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
                                    Service Price
                                </p>

                                <p className="mt-1 font-semibold text-lg">
                                    Rp{" "}
                                    {Number(serviceType.price).toLocaleString(
                                        "id-ID",
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Down Payment
                                </p>

                                <p className="mt-1 font-semibold text-lg">
                                    Rp{" "}
                                    {Number(
                                        serviceType.dp_amount,
                                    ).toLocaleString("id-ID")}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Description
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
        </div>
    );
}
