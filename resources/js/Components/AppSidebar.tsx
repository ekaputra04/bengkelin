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
import { TUser } from "@/types/types";
import { Link, usePage } from "@inertiajs/react";

import { NavUser } from "./NavUser";

const adminNavGroups = [
    {
        title: "Dashboard",
        items: [
            {
                title: "Dashboard",
                url: "/admin/dashboard",
            },
        ],
    },
    {
        title: "Master Data",
        items: [
            {
                title: "Jenis Layanan",
                url: "/admin/dashboard/service-types",
            },
            {
                title: "Pengguna",
                url: "/admin/dashboard/users",
            },
            {
                title: "Kendaraan",
                url: "/admin/dashboard/vehicles",
            },
        ],
    },
    {
        title: "Servis Saya",
        items: [
            {
                title: "Pengajuan Servis",
                url: "/admin/dashboard/service-requests",
            },
        ],
    },
    {
        title: "Operasional",
        items: [
            {
                title: "Pengerjaan Bengkel",
                url: "/admin/dashboard/work-orders",
            },
        ],
    },
];

const customerNavGroups = [
    {
        title: "Dashboard",
        items: [
            {
                title: "Dashboard",
                url: "/customer/dashboard",
            },
        ],
    },
    {
        title: "Kendaraan Saya",
        items: [
            {
                title: "Kendaraan",
                url: "/customer/dashboard/vehicles",
            },
        ],
    },
    {
        title: "Servis Saya",
        items: [
            {
                title: "Pengajuan Servis",
                url: "/customer/dashboard/service-requests",
            },
        ],
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const {
        url,
        props: { auth },
    } = usePage();

    const user = auth.user as TUser;

    const navGroups =
        user.role === "admin" ? adminNavGroups : customerNavGroups;

    /*
     * Item aktif jika URL saat ini sama atau berada di
     * bawah path-nya (mis. /admin/dashboard/mechanics/3/edit
     * mengaktifkan menu Mekanik). Root /admin/dashboard hanya
     * aktif persis di halaman dashboard.
     */
    const isActive = (itemUrl: string) =>
        itemUrl === "/admin/dashboard"
            ? url === "/admin/dashboard"
            : url === itemUrl || url.startsWith(`${itemUrl}/`);

    return (
        <Sidebar {...props} className="bg-background">
            <SidebarHeader className="">
                <div className="flex items-center gap-2">
                    <div className="">
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            className="w-8 aspect-square"
                        />
                    </div>
                    <div className="">
                        <h1 className="font-bold text-primary text-xl">
                            Bengkelin
                        </h1>
                        <p className="text-muted-foreground text-xs">
                            Sistem Reservasi Bengkel
                        </p>
                    </div>
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
                                            render={<Link href={item.url} />}
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
            <NavUser />
        </Sidebar>
    );
}
