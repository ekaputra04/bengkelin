import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

import { DeleteServiceTypeDialog } from "@/Components/ServiceTypes/DeleteServiceTypeDialog";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { TServiceType } from "@/types/types";
import { Link } from "@inertiajs/react";

interface ServiceTypeActionsProps {
    serviceType: TServiceType;
}

export function ServiceTypeActions({ serviceType }: ServiceTypeActionsProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="ghost" className="p-0 w-8 h-8">
                        <span className="sr-only">Open menu</span>

                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <Link
                            href={route("service-types.show", serviceType.id)}
                        >
                            View
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        <Link
                            href={route("service-types.edit", serviceType.id)}
                        >
                            Edit
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={(event) => {
                            event.preventDefault();
                            setDeleteDialogOpen(true);
                        }}
                    >
                        <Trash2 className="mr-2 w-4 h-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteServiceTypeDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                serviceTypeId={serviceType.id as number}
                serviceTypeName={serviceType.name}
            />
        </>
    );
}
