import { PropsWithChildren, useEffect } from "react";

import { AppSidebar } from "@/Components/AppSidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Separator } from "@/Components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar";
import { toast, Toaster } from "@/Components/ui/toast";
import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";

interface FlashProps {
    flash: {
        success?: string;
        error?: string;
    };
}

export default function DashboardLayout({ children }: PropsWithChildren) {
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

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex items-center gap-2 px-4 border-b h-16 shrink-0">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Build Your Application
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <main className="p-8">{children}</main>
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    );
}
