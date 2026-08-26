import { TUser } from '@/types/types';
import { usePage } from '@inertiajs/react';

export function useAuth() {
    const auth = usePage().props.auth;

    const user = auth.user as TUser;

    return {
        auth,
        user,
        role: user.role,
    };
}
