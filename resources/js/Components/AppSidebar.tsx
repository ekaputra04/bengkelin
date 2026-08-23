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

const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
        {
            title: "Dashboard",
            url: "#",
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                    isActive: true,
                },
            ],
        },
        {
            title: "Master Data",
            url: "",
            items: [
                {
                    title: "Jenis Layanan",
                    url: "/dashboard/service-types",
                    isActive: false,
                },
                {
                    title: "Mekanik",
                    url: "/dashboard/mechanics",
                    isActive: false,
                },
            ],
        },
        {
            title: "Servis Saya",
            url: "",
            items: [
                {
                    title: "Pengajuan Servis",
                    url: "/dashboard/service-requests",
                    isActive: false,
                },
            ],
        },
        {
            title: "Operasional",
            url: "",
            items: [
                {
                    title: "Pengerjaan Bengkel",
                    url: "/dashboard/work-orders",
                    isActive: false,
                },
            ],
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <div className="">
                    <h1 className="font-bold text-xl">Bengkelin</h1>
                    <p className="text-muted-foreground text-xs">
                        Sistem Reservasi Bengkel
                    </p>
                </div>
            </SidebarHeader>
            <SidebarContent>
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            isActive={item.isActive}
                                        >
                                            <a href={item.url}>{item.title}</a>
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
