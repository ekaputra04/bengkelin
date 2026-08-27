import { FormEvent } from 'react';

import { ServiceTypeStatusBadge } from '@/Components/ServiceTypes/ServiceTypeStatusBadge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/Components/ui/select';
import { Spinner } from '@/Components/ui/spinner';
import { Switch } from '@/Components/ui/switch';
import { UserRoleBadge } from '@/Components/Users/UserRoleBadge';
import { userRoleOptions } from '@/consts/consts';
import { TUser } from '@/types/types';

interface Props {
    user: TUser;

    isEditing: boolean;

    role: string;
    isActive: boolean;

    processing: boolean;

    onRoleChange: (value: string) => void;
    onActiveChange: (value: boolean) => void;

    onSubmit: (event: FormEvent) => void;
    onCancel: () => void;
}

export default function UserInformationCard({
    user,
    isEditing,
    role,
    isActive,
    processing,
    onRoleChange,
    onActiveChange,
    onSubmit,
    onCancel,
}: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Informasi Pengguna</CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Nama</Label>

                        <p className="font-medium">{user.name}</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Email</Label>

                        <p className="font-medium">{user.email}</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Role</Label>

                        {isEditing ? (
                            <Select
                                value={role}
                                onValueChange={(value) =>
                                    onRoleChange(value as string)
                                }
                                disabled={processing}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih role" />
                                </SelectTrigger>

                                <SelectContent>
                                    {userRoleOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <UserRoleBadge role={user.role} />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>

                        {isEditing ? (
                            <div className="flex items-center gap-3">
                                <Switch
                                    checked={isActive}
                                    onCheckedChange={onActiveChange}
                                    disabled={processing}
                                />

                                <span className="text-sm">
                                    {isActive ? "Aktif" : "Tidak Aktif"}
                                </span>
                            </div>
                        ) : (
                            <ServiceTypeStatusBadge isActive={user.is_active} />
                        )}
                    </div>

                    {isEditing && (
                        <div className="flex justify-end gap-3 pt-5 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={processing}
                            >
                                Batal
                            </Button>

                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <>
                                        <Spinner />
                                        Simpan
                                    </>
                                ) : (
                                    "Simpan"
                                )}
                            </Button>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
