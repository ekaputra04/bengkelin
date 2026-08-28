import { ArrowLeft } from 'lucide-react';

import { AdminServiceRequestForm } from '@/Components/ServiceRequests/AdminServiceRequestForm';
import { CustomerServiceRequestForm } from '@/Components/ServiceRequests/CustomerServiceRequestForm';
import { Button } from '@/Components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { TServiceType, TUser, TVehicle } from '@/types/types';
import { Head, Link } from '@inertiajs/react';

interface Props {
    vehicles: TVehicle[];
    serviceTypes: TServiceType[];
    customers: TUser[];
}

export default function Create({ vehicles, serviceTypes, customers }: Props) {
    const { role } = useAuth();

    return (
        <DashboardLayout
            breadcrumbs={[
                {
                    label: "Pengajuan Servis",
                    href: route(role + ".service-requests.index"),
                },
                { label: "Ajukan" },
            ]}
        >
            <Head title="Ajukan Servis" />

            <div className="space-y-6 mx-auto max-w-3xl">
                <div className="flex items-center gap-4">
                    <Link href={route(role + ".service-requests.index")}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft />
                        </Button>
                    </Link>

                    <div>
                        <h1 className="font-semibold text-2xl tracking-tight">
                            Ajukan Servis
                        </h1>

                        <p className="text-muted-foreground text-sm">
                            {role === 'admin'
                                ? 'Pilih customer terdaftar, kendaraan, jenis servis, lalu tentukan tanggal dan jam kedatangan.'
                                : 'Pilih kendaraan, jenis servis, lalu tentukan tanggal dan jam kedatangan.'}
                        </p>
                    </div>
                </div>

                <div className="bg-card p-6 border rounded-xl">
                    {role === 'admin' ? (
                        <AdminServiceRequestForm
                            customers={customers}
                            serviceTypes={serviceTypes}
                        />
                    ) : (
                        <CustomerServiceRequestForm
                            vehicles={vehicles}
                            serviceTypes={serviceTypes}
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
