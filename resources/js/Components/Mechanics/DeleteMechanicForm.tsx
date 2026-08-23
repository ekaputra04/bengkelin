import { Trash } from "lucide-react";
import { FormEvent } from "react";

import { Button } from "@/Components/ui/button";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { TMechanic } from "@/types/types";
import { useForm } from "@inertiajs/react";

import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

interface Props {
    mechanic: TMechanic;
}

export function DeleteMechanicForm({ mechanic }: Props) {
    const form = useForm({});
    const { closeDialog } = useIsDialogOpenStore();

    const submitUrl = route("mechanics.destroy", mechanic.id);

    const submit = async (event: FormEvent) => {
        event.preventDefault();

        form.delete(submitUrl);

        closeDialog();
    };

    return (
        <form onSubmit={submit}>
            <Button
                type="submit"
                variant="destructive"
                disabled={form.processing}
                className={"w-full"}
            >
                {form.processing ? (
                    <>
                        <Spinner />
                        Proses
                    </>
                ) : (
                    <>
                        <Trash />
                        Hapus Mekanik
                    </>
                )}
            </Button>
        </form>
    );
}
