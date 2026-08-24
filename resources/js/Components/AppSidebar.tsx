import * as React from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/Components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";

const navGroups = [
    {
        title: "Dashboard",
        items: [
            {
                title: "Dashboard",
                url: "/dashboard",
            },
        ],
    },
    {
        title: "Master Data",
        items: [
            {
                title: "Jenis Layanan",
                url: "/dashboard/service-types",
            },
            {
                title: "Mekanik",
                url: "/dashboard/mechanics",
            },
            {
                title: "Pengguna",
                url: "/dashboard/users",
            },
            {
                title: "Kendaraan",
                url: "/dashboard/vehicles",
            },
        ],
    },
    {
        title: "Servis Saya",
        items: [
            {
                title: "Pengajuan Servis",
                url: "/dashboard/service-requests",
            },
        ],
    },
    {
        title: "Operasional",
        items: [
            {
                title: "Pengerjaan Bengkel",
                url: "/dashboard/work-orders",
            },
        ],
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { url } = usePage();

    /*
     * Item aktif jika URL saat ini sama atau berada di
     * bawah path-nya (mis. /dashboard/mechanics/3/edit
     * mengaktifkan menu Mekanik). Root /dashboard hanya
     * aktif persis di halaman dashboard.
     */
    const isActive = (itemUrl: string) =>
        itemUrl === "/dashboard"
            ? url === "/dashboard"
            : url === itemUrl || url.startsWith(`${itemUrl}/`);

    return (
        <Sidebar {...props} className="bg-background">
            <SidebarHeader className="">
                <div className="">
                    <h1 className="font-bold text-xl">Bengkelin</h1>
                    <p className="text-muted-foreground text-xs">
                        Sistem Reservasi Bengkel
                    </p>
                </div>
            </SidebarHeader>
            <SidebarContent>
                {navGroups.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            isActive={isActive(item.url)}
                                            render={
                                                <Link href={item.url} />
                                            }
                                        >
                                            {item.title}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
