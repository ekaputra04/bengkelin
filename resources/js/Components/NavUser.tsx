"use client";

import { ChevronsUpDown, LogOut, User } from "lucide-react";

import { router, usePage } from "@inertiajs/react";

import { Avatar, AvatarFallback } from "./ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "./ui/sidebar";
import { toast } from "./ui/toast";

export function NavUser() {
    const { isMobile } = useSidebar();

    const user = usePage().props.auth.user;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="rounded-lg w-8 h-8">
                                <AvatarFallback className="rounded-lg">
                                    CN
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 grid text-sm text-left leading-tight">
                                <span className="font-medium truncate">
                                    {user.name}
                                </span>
                                <span className="text-xs truncate">
                                    {user.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <div className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-sm text-left">
                                <Avatar className="rounded-lg w-8 h-8">
                                    <AvatarFallback className="rounded-lg">
                                        CN
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 grid text-sm text-left leading-tight">
                                    <span className="font-medium truncate">
                                        {user.name}
                                    </span>
                                    <span className="text-xs truncate">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <User />
                                Profil
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                router.post(route("logout"));
                                toast.add({
                                    title: "Logout",
                                    description: "Anda berhasil logout",
                                });
                            }}
                        >
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
