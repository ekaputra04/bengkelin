import { PropsWithChildren } from "react";

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
import { usePage } from "@inertiajs/react";

export default function DashboardLayout({ children }: PropsWithChildren) {
    const user = usePage().props.auth.user;

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
            </SidebarInset>
        </SidebarProvider>
    );
}
