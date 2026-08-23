import { ArrowLeft, Pencil } from "lucide-react";

import { ServiceTypeStatusBadge } from "@/Components/ServiceTypes/ServiceTypeStatusBadge";
import { Button } from "@/Components/ui/button";
import { TMechanic } from "@/types/types";
import { Head, Link } from "@inertiajs/react";

interface Props {
    mechanic: TMechanic;
}

export default function Show({ mechanic }: Props) {
    return (
        <div>
            <Head title={mechanic.name} />

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
                                {mechanic.name}
                            </h1>

                            <p className="text-muted-foreground text-sm">
                                Detail mekanik
                            </p>
                        </div>
                    </div>

                    <Link href={route("service-types.edit", mechanic.id)}>
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
                                    Nama Mekanik
                                </p>

                                <p className="mt-1 font-medium">
                                    {mechanic.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Nomer Telepon
                                </p>

                                <p className="mt-1 font-medium">
                                    {mechanic.phone}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Status
                                </p>

                                <div className="mt-1">
                                    <ServiceTypeStatusBadge
                                        isActive={mechanic.is_active}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
