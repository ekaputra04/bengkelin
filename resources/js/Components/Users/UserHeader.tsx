import { ArrowLeft, Pencil } from 'lucide-react';

import { Button } from '@/Components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { TUser } from '@/types/types';
import { Link } from '@inertiajs/react';

interface Props {
    user: TUser;
    isEditing: boolean;
    onEdit: () => void;
}

export default function UserHeader({ user, isEditing, onEdit }: Props) {
    const { role } = useAuth();
    const backUrl =
        role == "admin" ? "admin.users.index" : "customer.users.index";

    return (
        <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <Link href={route(backUrl)}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft />
                    </Button>
                </Link>

                <div>
                    <h1 className="font-semibold text-2xl tracking-tight">
                        {user.name}
                    </h1>

                    <p className="text-muted-foreground text-sm">
                        Detail pengguna
                    </p>
                </div>
            </div>

            {!isEditing && (
                <Button onClick={onEdit}>
                    <Pencil className="mr-2 w-4 h-4" />
                    Edit
                </Button>
            )}
        </div>
    );
}
