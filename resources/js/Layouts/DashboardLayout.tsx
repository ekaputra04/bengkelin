import { Fragment, PropsWithChildren, useEffect } from 'react';

import { AppSidebar } from '@/Components/AppSidebar';
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from '@/Components/ui/breadcrumb';
import { Separator } from '@/Components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/Components/ui/sidebar';
import { toast, Toaster } from '@/Components/ui/toast';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export interface BreadcrumbItemProp {
    label: string;
    href?: string;
}

interface FlashProps {
    flash: {
        success?: string;
        error?: string;
    };
}

interface Props extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItemProp[];
}

export default function DashboardLayout({ children, breadcrumbs = [] }: Props) {
    const { flash } = usePage<PageProps & FlashProps>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.add({
                title: "Aksi Berhasil",
                description: flash?.success,
            });
        }

        if (flash.error) {
            toast.add({
                title: "Aksi Gagal",
                description: flash.error,
            });
        }
    }, [flash]);

    /*
     * Root breadcrumb selalu Dashboard, sisanya dari prop
     * tiap halaman. Item terakhir ditampilkan sebagai halaman
     * aktif (bukan link).
     */
    const crumbs: BreadcrumbItemProp[] = [
        { label: "Dashboard", href: "#" },
        ...breadcrumbs,
    ];

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="z-0">
                <header className="flex items-center gap-2 px-4 border-b h-16 shrink-0">
                    <SidebarTrigger className="z-0 -ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            {crumbs.map((crumb, index) => {
                                const isLast = index === crumbs.length - 1;

                                return (
                                    <Fragment key={crumb.label}>
                                        <BreadcrumbItem
                                            className={
                                                index === 0
                                                    ? "hidden md:block"
                                                    : undefined
                                            }
                                        >
                                            {isLast || !crumb.href ? (
                                                <BreadcrumbPage>
                                                    {crumb.label}
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink
                                                    href={crumb.href}
                                                >
                                                    {crumb.label}
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>

                                        {!isLast && (
                                            <BreadcrumbSeparator className="hidden md:block" />
                                        )}
                                    </Fragment>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <main className="p-8">{children}</main>
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    );
}
